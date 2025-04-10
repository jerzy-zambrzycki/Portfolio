// firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGtdJhE3VnZVBKsiN3OIrq5uXwBe62ZhU",
  authDomain: "testjerzy2025.firebaseapp.com",
  projectId: "testjerzy2025",
  storageBucket: "testjerzy2025.firebasestorage.app",
  messagingSenderId: "873709567845",
  appId: "1:873709567845:web:41ac0dbed9aabde78c2b8c",
  measurementId: "G-3Z8J26Z4X5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };
