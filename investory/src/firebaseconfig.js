// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyClH94ssWeSqzYiWKJMW5tHleobW8cUGWc",
    authDomain: "investory-b6d8d.firebaseapp.com",
    databaseURL: "https://investory-b6d8d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "investory-b6d8d",
    storageBucket: "investory-b6d8d.appspot.com",
    messagingSenderId: "657562277037",
    appId: "1:657562277037:web:5b52fb09c670a1e67a6224",
    measurementId: "G-V7FYVKJ07J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { analytics, database, firestore };