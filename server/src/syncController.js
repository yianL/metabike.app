const { database } = require('../src/firebase');

async function resync(userId) {
  const userRef = await database.doc(`users/${userId}`);
  const user = await userRef.get();

  await userRef.update({
    'stravaCursor.syncInProgress': true,
  });

  return await database.collection('jobs').add({
    type: 'SyncStravaActivities',
    startTimestamp: user.data().stravaCursor.lastEventTimestamp,
    userId: userId,
    finishedAt: null,
  });
}

module.exports = {
  resync,
};
