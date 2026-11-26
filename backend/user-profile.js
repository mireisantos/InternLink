import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

//fetch user profile for UI display
export async function getUserProfile() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to view your profile.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User profile not found in database.");
    }

    const data = userSnap.data();

    //return needed for UI display
    return {
        uid: data.uid,
        fullName: data.fullName || "",
        email: data.email || "",
        school: data.school || "",
        course: data.course || "",
        profilePictureUrl: data.profilePictureUrl || "",
        profileStrength: data.profileStrength || 0
    };
}

//update profile and recalculate profile strength
export async function updateUserProfile(updates) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to update your profile.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        throw new Error("User profile not found.");
    }

    //merge existinf data with updates
    const currentData = userSnap.data();
    const mergedData = { ...currentData, ...updates };
    
    //calc profile strength, 20% each
    let strength = 0;
    if (mergedData.fullName?.trim()) strength += 20;
    if (mergedData.email?.trim()) strength += 20;
    if (mergedData.school?.trim()) strength += 20;
    if (mergedData.course?.trim()) strength += 20;
    if (mergedData.profilePictureUrl?.trim()) strength += 20;

    const finalUpdates = {
        ...updates,
        profileStrength: strength,
        updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, finalUpdates);
    
    return finalUpdates;
}