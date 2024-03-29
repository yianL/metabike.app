const { Firestore, FieldValue } = require('@google-cloud/firestore');
const { FirestoreStore } = require('@google-cloud/connect-firestore');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log(`Using production config credentials...`);
}

const firestoreDB = isProduction
  ? new Firestore({
      projectId: 'metabike-app',
      keyFilename: process.env.FIRESTORE_KEY_PATH,
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
  Firestore,
  FieldValue,
  database: firestoreDB,
  store: store,
};
