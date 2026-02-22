import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_nRBfVPnHZKmrMtjXFWhivn5UkOKgWPA",
  authDomain: "lab06expense.firebaseapp.com",
  projectId: "lab06expense",
  storageBucket: "lab06expense.firebasestorage.app",
  messagingSenderId: "212846147909",
  appId: "1:212846147909:web:c9f269d5ac8344d6c2262c"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);