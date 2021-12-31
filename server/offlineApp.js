const { database, FieldValue } = require('./src/firebase');
const axios = require('axios').default;
const moment = require('moment');

const STRAVA_API_V3_ENDPOINT = 'https://www.strava.com/api/v3';
const STRAVA_API_PAGE_SIZE = 100;

async function getAllStravaActivities(req, accessToken) {
  const { userId, startTimestamp } = req;

  const fetchStravaActivities = async function (page) {
    try {
      console.log(`Fetching activities for userId=${userId} page=${page}...`);
      const batch = database.batch();
      const response = await axios.get(
        `${STRAVA_API_V3_ENDPOINT}/athlete/activities`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            after: startTimestamp.seconds,
            page: page,
            per_page: STRAVA_API_PAGE_SIZE,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        response.data.forEach((activity) => {
          if (activity.type !== 'Ride' || activity.type !== 'VirtualRide') {
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
  console.log(`All done, commiting results...`);
}

async function processStravaSyncRequest(doc) {
  const { userId } = doc.data();
  const userDoc = database.doc(`users/${userId}`);
  const user = await userDoc.get();

  await getAllStravaActivities(doc.data(), user.data().accessToken);

  await database.collection('jobs').add({
    type: 'UpdateStatsFromActivities',
    userId: userId,
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
    bikes[key].totalElevationGainMeters = 0;
    bikes[key].totalKudos = 0;
    bikes[key].totalPRSmashed = 0;
    bikes[key].totalTimeOnBikeSeconds = 0;
    bikes[key].virtualDistanceMeters = 0;
    bikes[key].virtualElevationGainMeters = 0;
  });

  const allRidesRef = database
    .collection('activities')
    .where('userId', '==', userId);
  const allRides = await allRidesRef.get();

  console.log(
    `Going to update states for userId=${userId}. Total of ${allRides.size} activities...`
  );

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

    if (!bike) {
      console.warn(
        `gearId=${gearId} not found for userId=${userId}. Skipping record id=${ride.id}`
      );
      return;
    }

    bike.totalElevationGainMeters += elevationGainMeters;
    bike.totalKudos += kudosCount;
    bike.totalPRSmashed += prCount;
    bike.totalTimeOnBikeSeconds += movingTimeSeconds;

    if (type === 'VirtualRide') {
      bike.virtualDistanceMeters += distanceMeters;
      bike.virtualElevationGainMeters += elevationGainMeters;
    }
  });

  // persist values back
  console.log(`Persisting updated stats for userId=${userId}...`);
  await userRef.update({
    bikes: bikes,
  });

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
          if (change.doc.data().type === 'SyncStravaActivities') {
            processStravaSyncRequest(change.doc);
          } else if (change.doc.data().type === 'UpdateStatsFromActivities') {
            updateStatsFromActivities(change.doc);
          }
        }
        if (change.type === 'modified') {
          console.log('Modified request: ', change.doc.id);
        }
        if (change.type === 'removed') {
          console.log('Removed request: ', change.doc.id);
        }
      });
    });
}

module.exports = {
  start: start,
};
