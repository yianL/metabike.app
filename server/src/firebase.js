const { Firestore, FieldValue } = require('@google-cloud/firestore');
const { FirestoreStore } = require('@google-cloud/connect-firestore');

const isProduction = process.env.NODE_ENV === 'production';
const firestoreDB = isProduction
  ? new Firestore({
      projectId: 'metabike-app',
      keyFilename: '/Users/a.lai/.gcp/yian-dev-0f3533367dfc.json', // TODO: changeme
    })
  : new Firestore({
      projectId: 'metabike-app',
      host: 'localhost:8080',
      ssl: false,
    });

const store = new FirestoreStore({
  dataset: firestoreDB,
  kind: 'sessions',
});

module.exports = {
  FieldValue,
  database: firestoreDB,
  store: store,
};
