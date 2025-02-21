import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD74XO4JWfNABSeaa0AEIPTRoG2sRLk8_g",
  authDomain: "task-management-999.firebaseapp.com",
  projectId: "task-management-999",
  storageBucket: "task-management-999.firebasestorage.app",
  messagingSenderId: "495163295250",
  appId: "1:495163295250:web:b2dcd2a7252db0c8b07acb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };