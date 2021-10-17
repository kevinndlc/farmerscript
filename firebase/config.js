import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwKB85xY7cKp0Y97dzejbgDzZioPx3m_c",
  authDomain: "farmerscript.firebaseapp.com",
  projectId: "farmerscript",
  storageBucket: "farmerscript.appspot.com",
  messagingSenderId: "757721257198",
  appId: "1:757721257198:web:7970cdffe42d1172a50fff",
  measurementId: "G-L81B6D02C0"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, collection, doc, getDocs, addDoc, updateDoc, Timestamp }