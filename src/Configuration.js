// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from  'firebase/firestore';
import { getStorage } from "firebase/storage"; // ✅ Make sure this is here
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJdDYhJ8dfMbvrfsjRFwolnzayqeyPQso",
    authDomain: "recycle-dff2d.firebaseapp.com",
    projectId: "recycle-dff2d",
    storageBucket: "recycle-dff2d.firebasestorage.app",
    messagingSenderId: "381644570356",
    appId: "1:381644570356:web:184c4c41ed0c91bc7268a1",
    measurementId: "G-M9R0SF271L"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app)
export const storage = getStorage(app); // ← Add this line!
//const analytics = getAnalytics(app);




