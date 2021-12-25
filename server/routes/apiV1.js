const router = require('express').Router();

router.get('/me', function (req, res, next) {
  const { user } = req;
  if (user) {
    res.status(200).json(user);
  }

  res.status(401).json({
    code: 401,
    error: 'Unauthorized',
  });
});

module.exports = router;
