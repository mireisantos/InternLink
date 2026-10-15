import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

//fetch users saved ints array
export async function getSavedInternships() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to view saved internships.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User profile not found.");
    }

    //return exact json reqested 
    return {
        savedInternships: userSnap.data().savedInternships || []
    };
}

//toggle jobID in saved array. + if missing, - if existing
export async function toggleSavedInternship(jobId) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to save internships.");
    }
    if (!jobId?.trim()) {
        throw new Error("Job ID is required.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        throw new Error("User profile not found.");
    }

    const saved = userSnap.data().savedInternships || [];
    const isCurrentlySaved = saved.includes(jobId);

    //if posting is already saved, remove. if not, save
    await updateDoc(userRef, {
        savedInternships: isCurrentlySaved ? arrayRemove(jobId) : arrayUnion(jobId)
    });

    return { 
        jobId, 
        isSaved: !isCurrentlySaved 
    };
}