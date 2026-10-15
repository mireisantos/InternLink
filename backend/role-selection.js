import {
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig.js";

export async function selectRole(role) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to select a role.");
    }

    if (!["student", "employer"].includes(role)) {
        throw new Error("Invalid role. Must be either student or employer.");
    }

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp(),
    });

    return role;
}

//Aliases for alternate naming conventions
export const setRole = selectRole;
export const saveRole = selectRole;
export const chooseRole = selectRole;
export const updateUserRole = selectRole;
export const saveRoleSelection = selectRole;
export const selectUserRole = selectRole;

export default {
    selectRole,
    setRole,
    saveRole,
    chooseRole,
    updateUserRole,
    saveRoleSelection,
    selectUserRole,
};