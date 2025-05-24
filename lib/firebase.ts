// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT8C2BIp3p3NmITz-rdTQxlYLb2JRr85U",
  authDomain: "auto-fa9c2.firebaseapp.com",
  projectId: "auto-fa9c2",
  storageBucket: "auto-fa9c2.firebasestorage.app",
  messagingSenderId: "891566749641",
  appId: "1:891566749641:web:f6b2fbdea96473b9099a18",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
