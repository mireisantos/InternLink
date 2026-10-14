import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig.js";

export async function applyForInternship({ 
    jobId,
    fullLegalName,
    contactEmail,
    phoneNumber,
    school,
    course,
    resumeUrl,
}) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to apply for an internship.");
    }

    if (!jobId?.trim()) {
        throw new Error("Internship ID is required.");
    }

    if (!fullLegalName?.trim()) {
        throw new Error("Full legal name is required.");
    }

    if (!contactEmail?.trim()) {
        throw new Error("Contact email is required.");
    }

    if (!phoneNumber?.trim()) {
        throw new Error("Phone number is required.");
    }

    if (!school?.trim()) {
        throw new Error("School is required.");
    }

    if (!course?.trim()) {
        throw new Error("Course is required.");
    }

    if (resumeUrl && typeof resumeUrl !== "string") {
        throw new Error("Resume URL must be a string.");
    }

    const internshipRef = doc(db, "internships", jobId);
    const internshipSnapshot = await getDoc(internshipRef);

    if (!internshipSnapshot.exists()) {
        throw new Error("Internship not found.");
    }

    const internshipData = internshipSnapshot.data();

    if (internshipData.isActive !== true){
        throw new Error("This internship is not currently accepting applications.");
    }

    if (internshipData.requiresResume && !resumeUrl) {
        throw new Error("This internship requires a resume to apply.");
    }

    const applicationData = {
        studentId: user.uid,
        employerId: internshipData.employerId, 
        jobId,
        fullLegalName: fullLegalName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        school: school.trim(),
        course: course.trim(),
        resumeUrl: resumeUrl ? resumeUrl.trim() : "", 
        status: "pending",
        appliedAt: serverTimestamp(),
    };

    const applicationRef = await addDoc(
        collection(db, "applications"),
        applicationData
    );
    
    return applicationRef.id;
}