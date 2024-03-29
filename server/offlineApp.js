require('dotenv').config();

const { Firestore, database, FieldValue } = require('./src/firebase');
const StravaApi = require('./src/stravaAPI');
const moment = require('moment');

async function refreshStravaAPIToken({ userId }) {
  console.log(`Will refresh accessToken for user=${userId}`);
  const currentUserRef = await database.doc(`users/${userId}`);
  const user = await currentUserRef.get();
  const response = await StravaApi.renewToken({
    refreshToken: user.data().refreshToken,
  });

  await currentUserRef.update({
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  });

  return response.access_token;
}

async function getAllStravaActivities(req, accessToken) {
  const { userId, startTimestamp } = req;

  const fetchStravaActivities = async function (page) {
    try {
      console.log(`Fetching activities for userId=${userId} page=${page}...`);
      const batch = database.batch();
      const activities = await StravaApi.getActivities({
        accessToken,
        startTimestamp,
        page,
      });

      if (activities && activities.length > 0) {
        activities.forEach((activity) => {
          if (!(activity.type === 'Ride' || activity.type === 'VirtualRide')) {
            return;
          }

          const ref = database.collection('activities').doc(`${activity.id}`);
          batch.set(ref, {
            userId: activity.athlete.id,
            name: activity.name,
            distanceMeters: activity.distance,
            movingTimeSeconds: activity.moving_time,
            elapsedTimeSeconds: activity.elapsed_time,
            elevationGainMeters: activity.total_elevation_gain,
            type: activity.type,
            startTimestamp: moment(activity.start_date).valueOf(),
            kudosCount: activity.kudos_count,
            prCount: activity.pr_count,
            gearId: activity.gear_id,
          });
        });
        await batch.commit();
        return fetchStravaActivities(page + 1);
      }

      return;
    } catch (error) {
      console.error(error.toString());
    }
  };

  await fetchStravaActivities(1);
  console.log(`All done, committing results...`);
}

async function processStravaSyncRequest(doc) {
  const { userId } = doc.data();

  const accessToken = await refreshStravaAPIToken({ userId });
  await getAllStravaActivities(doc.data(), accessToken);

  await database.collection('jobs').add({
    type: 'UpdateStatsFromActivities',
    userId: userId,
    finishedAt: null,
  });

  return database.collection('jobs').doc(doc.id).update({
    finishedAt: FieldValue.serverTimestamp(),
  });
}

async function updateStatsFromActivities(doc) {
  const { userId } = doc.data();

  const userRef = database.doc(`users/${userId}`);
  const user = await userRef.get();
  const { bikes } = user.data();

  // reset virtual stats
  Object.keys(bikes).forEach((key) => {
    bikes[key].totalDistanceMeters = 0;
    bikes[key].totalElevationGainMeters = 0;
    bikes[key].totalKudos = 0;
    bikes[key].totalPRSmashed = 0;
    bikes[key].totalTimeOnBikeSeconds = 0;
    bikes[key].virtualDistanceMeters = 0;
    bikes[key].virtualElevationGainMeters = 0;
  });

  const allRidesRef = database
    .collection('activities')
    .where('userId', '==', userId)
    .orderBy('startTimestamp');
  const allRides = await allRidesRef.get();

  console.log(
    `Going to update states for userId=${userId}. Total of ${allRides.size} activities...`
  );

  const summary = {
    totalDistanceMeters: 0,
    totalElevationGainMeters: 0,
    totalVirtualDistanceMeters: 0,
    totalVirtualElevationGainMeters: 0,
  };

  allRides.forEach((ride) => {
    const {
      distanceMeters,
      elevationGainMeters,
      movingTimeSeconds,
      kudosCount,
      prCount,
      gearId,
      type,
    } = ride.data();
    const bike = bikes[gearId];

    summary.totalDistanceMeters += distanceMeters;
    summary.totalElevationGainMeters += elevationGainMeters;

    if (!bike) {
      console.warn(
        `gearId=${gearId} not found for userId=${userId}. Skipping record id=${ride.id}`
      );
      return;
    }

    bike.totalDistanceMeters += distanceMeters;
    bike.totalElevationGainMeters += elevationGainMeters;
    bike.totalKudos += kudosCount;
    bike.totalPRSmashed += prCount;
    bike.totalTimeOnBikeSeconds += movingTimeSeconds;

    if (type === 'VirtualRide') {
      bike.virtualDistanceMeters += distanceMeters;
      bike.virtualElevationGainMeters += elevationGainMeters;
      summary.totalVirtualDistanceMeters += distanceMeters;
      summary.totalVirtualElevationGainMeters += elevationGainMeters;
    }
  });

  // persist values back
  console.log(`Persisting updated stats for userId=${userId}...`);

  const latestRide = allRides.docs[allRides.size - 1].data();
  await userRef.update({
    bikes,
    summary,
    stravaCursor: {
      syncInProgress: false,
      lastEventTimestamp: Firestore.Timestamp.fromMillis(
        latestRide.startTimestamp
      ),
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  return database.collection('jobs').doc(doc.id).update({
    finishedAt: FieldValue.serverTimestamp(),
  });
}

async function ignoreJob(doc) {
  return database.collection('jobs').doc(doc.id).update({
    finishedAt: FieldValue.serverTimestamp(),
  });
}

function start() {
  return database
    .collection('jobs')
    .where('finishedAt', '==', null)
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('New request: ', change.doc.id);
          const { type } = change.doc.data();
          switch (type) {
            case 'SyncStravaActivities':
              processStravaSyncRequest(change.doc);
              break;
            case 'UpdateStatsFromActivities':
              updateStatsFromActivities(change.doc);
              break;
            default:
              console.log(`Ignoring unrecognized job. type=${type}...`);
              ignoreJob(change.doc);
          }
        } else if (change.type === 'modified') {
          console.log('Modified request: ', change.doc.id);
        } else if (change.type === 'removed') {
          console.log('Removed request: ', change.doc.id);
        }
      });
    });
}

module.exports = {
  start: start,
};
