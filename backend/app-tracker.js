import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

//fetch user data
export async function getStudentApplications() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You must be logged in to view applications.");
    }

    //get users saved inbterships array first
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const savedJobs = userSnap.exists() ? (userSnap.data().savedInternships || []) : [];

    //fetch application
    const appsRef = collection(db, "applications");
    const q = query(appsRef, where("studentId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const trackerData = [];
    querySnapshot.forEach((docSnap) => {
        const appData = docSnap.data();
        trackerData.push({
            applicationId: docSnap.id,
            studentId: appData.studentId,
            jobId: appData.jobId,
            status: appData.status, //"Applied", "Interview", "Accepted", "Rejected"
            isSaved: savedJobs.includes(appData.jobId)
        });
    });

    return trackerData;
}

//manual/tap 
export async function updateApplicationStatus(applicationId, newStatus) {
    const validStatuses = ["pending", "under review", "interview", "accepted", "rejected"];
    
    if (!validStatuses.includes(newStatus)) {
        throw new Error("Invalid status update.");
    }

    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to update an application.");

    const appRef = doc(db, "applications", applicationId);
    const appSnapshot = await getDoc(appRef);
    if (!appSnapshot.exists() || appSnapshot.data().employerId !== user.uid) {
        throw new Error("Only the employer who received this application can update its status.");
    }

    await updateDoc(appRef, { status: newStatus });
}

//for toggle: save/unsave internship
export async function toggleSavedInternship(jobId) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You must be logged in to save internships.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        throw new Error("User document not found.");
    }

    const savedJobs = userSnap.data().savedInternships || [];
    const isCurrentlySaved = savedJobs.includes(jobId);

    //if alreedy saved, remove. if not, add.
    await updateDoc(userRef, {
        savedInternships: isCurrentlySaved ? arrayRemove(jobId) : arrayUnion(jobId)
    });

    //return to new state/status
    return !isCurrentlySaved; 
}