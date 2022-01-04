const router = require('express').Router();

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
