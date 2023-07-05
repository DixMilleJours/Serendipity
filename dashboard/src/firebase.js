// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQME066KVsDp1NnTkU13SgCT7tNua5OU4",
    authDomain: "serendipity-e1c63.firebaseapp.com",
    projectId: "serendipity-e1c63",
    storageBucket: "serendipity-e1c63.appspot.com",
    messagingSenderId: "17203346766",
    appId: "1:17203346766:web:c4fd7c3d8e9930b271b21f",
    measurementId: "G-XZLPW34JCM"
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const auth = getAuth(app)
const google = new GoogleAuthProvider();

export { auth, firestore, app, google }