const router = require('express').Router();

function getStatus(user) {
  const { stravaCursor } = user;

  if (stravaCursor.lastEventTimestamp === null) {
    return 'PendingInitialSync';
  }

  return stravaCursor.syncInProgress ? 'Syncing' : 'Synced';
}

router.get('/me', function (req, res, next) {
  const { user } = req;
  if (user) {
    const userResponse = {
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
    return;
  }

  res.status(401).json({
    code: 401,
    error: 'Unauthorized',
  });
});

module.exports = router;
