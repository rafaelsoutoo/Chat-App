import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYEzGbRoiBmRbmfIU1fO2BUimo4eb6uhg",
  authDomain: "chat-online-5a0fc.firebaseapp.com",
  projectId: "chat-online-5a0fc",
  storageBucket: "chat-online-5a0fc.appspot.com",
  messagingSenderId: "754691489979",
  appId: "1:754691489979:web:4f3e6043f49cb87e42299e",
  measurementId: "G-PMG2R5QMHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db }