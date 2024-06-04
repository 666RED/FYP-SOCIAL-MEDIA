// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCpZpIlyoFU6L9gSzlSVr7n36lwb-xwsuw",
	authDomain: "final-year-project-d85b9.firebaseapp.com",
	projectId: "final-year-project-d85b9",
	storageBucket: "final-year-project-d85b9.appspot.com",
	messagingSenderId: "134995798212",
	appId: "1:134995798212:web:95ddd5e83ba4d453964191",
	measurementId: "G-DSET7Z40K5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
