import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvEA_kPYVO-XjsMQqp0-owSK86EhvohCU",
  authDomain: "dashboard-drones.firebaseapp.com",
  projectId: "dashboard-drones",
  storageBucket: "dashboard-drones.firebasestorage.app",
  messagingSenderId: "1093557142085",
  appId: "1:1093557142085:web:3be4cfa7a01df85475d92c",
  measurementId: "G-FDNDWLXHV2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
