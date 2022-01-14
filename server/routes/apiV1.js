const router = require('express').Router();
const SyncController = require('../src/syncController');

function getStatus(user) {
  const { stravaCursor } = user;

  if (stravaCursor.lastEventTimestamp === null) {
    return 'PendingInitialSync';
  }

  return stravaCursor.syncInProgress ? 'Syncing' : 'Synced';
}

router.get('/me', function (req, res, next) {
  const { user } = req;
  if (!user) {
    res.status(401).json({
      code: 401,
      error: 'Unauthorized',
    });
    return;
  }

  const userResponse = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    location: user.location,
    updatedAt: user.updatedAt.seconds,
    avatar: user.avatar,
    bikes: user.bikes,
    summary: user.summary,
    syncStatus: {
      status: getStatus(user),
      lastEventTimestamp: user.stravaCursor.lastEventTimestamp
        ? user.stravaCursor.lastEventTimestamp.seconds
        : null,
    },
  };

  res.status(200).json(userResponse);
});

router.post('/me/resync', async function (req, res, next) {
  const { user } = req;
  if (!user) {
    res.status(401).json({
      code: 401,
      error: 'Unauthorized',
    });
    return;
  }

  await SyncController.resync(user.id);
  res.status(200).send();
});

module.exports = router;
