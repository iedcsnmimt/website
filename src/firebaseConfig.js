import firebase from "firebase/compat/app"; // Import Firebase
import "firebase/compat/database"; // Import Firebase Realtime Database
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage'; // Import Firebase Storage
import 'firebase/compat/analytics';




const firebaseConfig = {
    apiKey: "AIzaSyADzCR7t84JhxNaxv-pBvmtGQrLbmB4axE",
    authDomain: "iedcsnmimtadmin.firebaseapp.com",
    databaseURL: "https://iedcsnmimtadmin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iedcsnmimtadmin",
    storageBucket: "iedcsnmimtadmin.appspot.com",
    messagingSenderId: "1050421756481",
    appId: "1:1050421756481:web:9d12b833e2246c2fe3fcc0",
    measurementId: "G-TWWMQ2QTNM"


    
};


// Initialize Firebase with your configuration
const firebaseApp = firebase.initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();


const analytics = firebase.analytics();



const firestore = firebase.firestore();




export const auth = app.auth();
export const db = firebaseApp.database();
export { firestore, storage,analytics };
