// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoxX34eFRnF6WxruSo69TXgHLupk4-Nxg",
  authDomain: "video-streaming-c0e49.firebaseapp.com",
  projectId: "video-streaming-c0e49",
  appId: "1:264117078021:web:d37778a7211a87edbdb46c",
  measurementId: "G-BD1XXQXGYE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Signs the user in using a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
};

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOutGoogleAccount() {
    return auth.signOut();
};

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
};