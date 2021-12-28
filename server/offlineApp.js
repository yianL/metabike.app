const { database } = require('./src/firebase');
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

  return database.collection('jobs').doc(doc.id).delete();
}

function start() {
  return database.collection('jobs').onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New request: ', change.doc.data());
        if (change.doc.data().type === 'SyncStravaActivities') {
          processStravaSyncRequest(change.doc);
        }
      }
      if (change.type === 'modified') {
        console.log('Modified request: ', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed request: ', change.doc.data());
      }
    });
  });
}

module.exports = {
  start: start,
};
