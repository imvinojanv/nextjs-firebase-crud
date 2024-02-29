import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';          // changed

const firebaseConfig = {
  apiKey: "AIzaSyDxT9sWO6X3Mb-eFOj2l5rM3vO_OrwUljw",
  authDomain: "nextjs-crud-app-12295.firebaseapp.com",
  projectId: "nextjs-crud-app-12295",
  storageBucket: "nextjs-crud-app-12295.appspot.com",
  messagingSenderId: "150064386567",
  appId: "1:150064386567:web:54f075a335c7d16f1810a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);                   // changed

export { db };              // changed