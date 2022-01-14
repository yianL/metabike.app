const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/login/federated/strava',
  passport.authenticate('strava', {
    scope: ['profile:read_all,activity:read_all'],
    approval_prompt: 'auto',
  })
);

router.get(
  '/oauth2/redirect/strava',
  passport.authenticate('strava', {
    assignProperty: 'federatedUser',
    failureRedirect: '/',
  }),
  function (req, res, next) {
    // check accepted scope here
    const acceptedPermissions = req.query.scope;
    if (
      !acceptedPermissions.includes('profile:read_all') ||
      !acceptedPermissions.includes('activity:read_all')
    ) {
      next(new Error('Please accept all permissions to continue'));
      return;
    }

    req.login(req.federatedUser, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
);

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
