import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

/** False when the EXPO_PUBLIC_FIREBASE_* values are missing from .env. */
export const firebaseReady: boolean;

/**
 * Typed as non-null for convenience. At runtime these are null when
 * `firebaseReady` is false, so Firebase calls fail (and are caught) instead
 * of crashing the app at startup.
 */
export const auth: Auth;
export const db: Firestore;
