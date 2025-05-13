// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addOrUpdateAvailability = async (
  refereeName,
  weekStart,
  availability
) => {
  const docRef = doc(db, "availability", refereeName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const existingData = docSnap.data().availability || {};
    existingData[weekStart] = availability;
    await updateDoc(docRef, { availability: existingData });
  } else {
    await setDoc(docRef, {
      refereeName,
      availability: { [weekStart]: availability },
      timestamp: new Date(),
    });
  }
};
export { db };
export { addOrUpdateAvailability };
