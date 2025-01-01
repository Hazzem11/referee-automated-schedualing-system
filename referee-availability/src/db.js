// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrQkUeFkdeSFqfigF1BIbKEUSIQlZqrCE",
  authDomain: "referee-availability-manager.firebaseapp.com",
  projectId: "referee-availability-manager",
  storageBucket: "referee-availability-manager.firebasestorage.app",
  messagingSenderId: "10335885142",
  appId: "1:10335885142:web:28338b5cffc871df91e8f7",
  measurementId: "G-5Y355WDWT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addOrUpdateAvailability = async (refereeName, weekStart, availability) => {
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
      timestamp: new Date()
    });
  }
};

export { addOrUpdateAvailability };
