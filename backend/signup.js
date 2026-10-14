import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    doc,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";


export async function signUpUser({
    fullName,
    email,
    password,
    role = "student",
    termsAccepted,
}) {
    if(!fullName?.trim()){
        throw new Error("Full name is required");
    }

    if(!email?.trim()||!password){
        throw new Error("Email and password are required");
    }

    if(termsAccepted !== true){
        throw new Error("You must accept the terms and conditions");
    }

    if (!["student", "employer"].includes(role)) {
        throw new Error("Invalid role. Must be either student or employer.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const credential = await createUserWithEmailAndPassword(
        auth, 
        normalizedEmail, 
        password
    );

    const user = credential.user;

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName.trim(),
        email: normalizedEmail,
        role: role,
        profileStrength:0,
        savedInternships: [],
        termsAgreedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return user;
}
