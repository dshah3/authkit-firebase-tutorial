import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDJ2G4OXHtBWpGuECgR33a_DPshfQ3ZCwM",
    authDomain: "authkit-firebase-tutorial.firebaseapp.com",
    databaseURL: "https://authkit-firebase-tutorial-default-rtdb.firebaseio.com",
    projectId: "authkit-firebase-tutorial",
    storageBucket: "authkit-firebase-tutorial.appspot.com",
    messagingSenderId: "299685560956",
    appId: "1:299685560956:web:c476e7df7aac805228bff9",
    measurementId: "G-9PFWQ5BSCT"
  }

const app = initializeApp(firebaseConfig)

const database = getDatabase(app)

export { app, database }