const passport = require('passport');
const StravaStrategy = require('passport-strava').Strategy;
const moment = require('moment');
const { Timestamp } = require('@google-cloud/firestore');
const { database, FieldValue } = require('./firebase');

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
        const { id, _json } = profile;
        const userDocument = database.doc(`users/${id}`);
        const doc = await userDocument.get();

        const mappedUserProfile = {
          firstname: _json.firstname,
          lastname: _json.lastname,
          location: {
            city: _json.city,
            state: _json.state,
            country: _json.country,
          },
          sex: _json.sex,
          accessToken: accessToken,
          refreshToken: refreshToken,
          updatedAt: FieldValue.serverTimestamp(),
          avatar: _json.profile,
        };

        if (!doc.exists) {
          mappedUserProfile.createdAt = Timestamp.fromMillis(
            moment(_json.created_at).valueOf()
          );
          mappedUserProfile.stravaCursor = {
            syncPending: true,
            lastEventTimestamp: 0,
          };
          mappedUserProfile.bikes = _json.bikes.reduce((prev, curr) => {
            prev[curr.id] = {
              primary: curr.primary,
              name: curr.name,
              nickname: curr.nickname,
              retired: curr.retired,
              updatedAt: FieldValue.serverTimestamp(),
              totalDistanceMeters: curr.distance,
              virtualDistanceMeters: 0,
              totalElevationGainMeters: 0,
              virtualElevationGainMeters: 0,
              totalTimeOnBikeSeconds: 0,
              totalKudos: 0,
              totalPRSmashed: 0,
            };
            return prev;
          }, {});

          await userDocument.set(mappedUserProfile);
          // add job to the queue

          await database.collection('jobs').add({
            type: 'SyncStravaActivities',
            userId: id,
            startTimestamp: mappedUserProfile.createdAt,
            finishedAt: null,
          });
        } else {
          // TODO: update bikes

          await userDocument.update(mappedUserProfile);
        }

        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    cb(null, {
      id: user.id,
    });
  });

  passport.deserializeUser(async function (obj, cb) {
    const userDocument = database.doc(`users/${obj.id}`);
    const doc = await userDocument.get();
    const data = doc.data();

    cb(null, data);
  });
};
