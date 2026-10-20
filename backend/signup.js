import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

export async function signUpUser({
    fullName,
    email,
    password,
    role = "student",
    termsAccepted,
} = {}) {
    if (typeof fullName !== "string" || !fullName.trim()) {
        throw new Error("Full name is required");
    }
    if (typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password) {
        throw new Error("Email and password are required");
    }
    if (termsAccepted !== true) {
        throw new Error("You must accept the terms and conditions");
    }
    if (!["student", "employer"].includes(role)) {
        throw new Error("Invalid role. Must be either student or employer.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = auth.currentUser;
    if (user && user.email?.toLowerCase() !== normalizedEmail) {
        throw new Error("Sign out of your current account before registering another account.");
    }
    // Firebase signs in newly created accounts. Reuse that session on retry.
    if (!user) {
        ({ user } = await createUserWithEmailAndPassword(auth, normalizedEmail, password));
    }

    try {
        const profileRef = doc(db, "users", user.uid);
        await runTransaction(db, async (transaction) => {
            const existing = await transaction.get(profileRef);
            // A retry must never reset an existing profile, role, or saved jobs.
            if (existing.exists()) return;
            transaction.set(profileRef, {
                uid: user.uid,
                fullName: fullName.trim(),
                email: normalizedEmail,
                role,
                profileStrength: 0,
                savedInternships: [],
                termsAgreedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        });
    } catch (cause) {
        const error = new Error(
            "Your account exists, but profile setup could not finish. Stay signed in and retry. If you restarted the app, sign in before retrying profile setup.",
            { cause },
        );
        error.code = "signup/profile-incomplete";
        throw error;
    }
    return user;
}
