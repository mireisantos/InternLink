
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// initializeAuth throws "auth/invalid-api-key" synchronously when the config is
// missing, which would crash every route at import time. Only initialize when
// the required values exist; screens check `firebaseReady` before using Firebase.
export const firebaseReady = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

if (!firebaseReady) {
  console.warn(
    "Firebase is not configured. Copy .env.example to .env, fill in the EXPO_PUBLIC_FIREBASE_* values, and restart Expo with `npx expo start -c`."
  );
}

const app = firebaseReady ? initializeApp(firebaseConfig) : null;

// getReactNativePersistence only exists in the React Native build of firebase/auth.
export const auth = app
  ? Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : null;

export const db = app ? getFirestore(app) : null;
