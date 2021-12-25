const passport = require('passport');
const StravaStrategy = require('passport-strava').Strategy;
const { database } = require('./firebase');

module.exports = function () {
  passport.use(
    new StravaStrategy(
      {
        clientID: process.env.STRAVA_CLIENT_ID,
        clientSecret: process.env.STRAVA_CLIENT_SECRET,
        callbackURL: process.env.PUBLIC_URL + '/oauth2/redirect/strava',
        state: true,
      },
      async function (accessToken, refreshToken, profile, cb) {
        const userId = profile.id;
        const userDocument = database.doc(`users/${userId}`);
        const doc = await userDocument.get();

        if (!doc.exists) {
          await userDocument.set({
            name: profile.name,
            city: profile._json.city,
          });
        }

        await userDocument.update({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    // console.log("IMMA Serialize", user)
    cb(null, {
      id: user.id,
    });
  });

  passport.deserializeUser(async function (obj, cb) {
    // console.log("IMMA Deserialize", obj)

    const userDocument = database.doc(`users/${obj.id}`);
    const doc = await userDocument.get();
    const data = doc.data();

    cb(null, {
      id: doc.id,
      name: data.name,
      accessToken: data.accessToken,
    });
  });
};
