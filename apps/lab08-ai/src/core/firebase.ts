import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjMSllMURub-egestm6YqsZA14dgdkYt0",
  authDomain: "lab07-1a6e8.firebaseapp.com",
  projectId: "lab07-1a6e8",
  storageBucket: "lab07-1a6e8.firebasestorage.app",
  messagingSenderId: "628399798765",
  appId: "1:628399798765:web:b36b6b8d59605ad71c4fe4",
  measurementId: "G-BXCYRLM339"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);