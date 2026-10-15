import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

//fetch users settings
export async function getSettings() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to view settings.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User profile not found.");
    }

    const data = userSnap.data();

    //return json schema -- false if none
    return {
        userId: user.uid,
        notificationsEnabled: data.notificationsEnabled ?? false 
    };
}

//update user notif -- DI PA TO SURE, WAIT LANG
export async function updateSettings(notificationsEnabled) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to update settings.");
    }
    
    if (typeof notificationsEnabled !== "boolean") {
        throw new Error("notificationsEnabled must be a boolean value (true or false).");
    }

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
        notificationsEnabled: notificationsEnabled
    });

    return {
        userId: user.uid,
        notificationsEnabled: notificationsEnabled
    };
}