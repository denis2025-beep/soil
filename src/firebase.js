// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBsLiIu-QPeut9aGwEVOav2Pxtm2fE9myc",
  authDomain: "cabb-cfba0.firebaseapp.com",
  databaseURL: "https://cabb-cfba0-default-rtdb.firebaseio.com",
  projectId: "cabb-cfba0",
  storageBucket: "cabb-cfba0.appspot.com",
  messagingSenderId: "761679806757",
  appId: "1:761679806757:web:df5aebebdba9b5d8591acc"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
