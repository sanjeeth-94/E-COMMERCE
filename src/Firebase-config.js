import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyC296Y3ohWGpYcDUGcGQFa6xiA9aKKFbBM",
    authDomain: "event-registor.firebaseapp.com",
    projectId: "event-registor",
    storageBucket: "event-registor.appspot.com", 
    messagingSenderId: "971364699857",
    appId: "1:971364699857:web:da3e602966aacf81ce3ff0",
    measurementId: "G-BJSNRMMTM8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
