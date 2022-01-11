import { initializeApp } from 'firebase/app';
import { getAnalytics, setUserId } from 'firebase/analytics';

const firebaseConfig = {
  projectId: 'metabike-app',
  authDomain: 'metabike-app.firebaseapp.com',
  storageBucket: 'metabike-app.appspot.com',
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const setUser = (id) => setUserId(analytics, id);
