import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
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

    const profileSnapshot = await getDoc(doc(db, "users", user.uid));
    if (!profileSnapshot.exists() || profileSnapshot.data().role !== "student") {
        throw new Error("Only student accounts can apply for internships.");
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

    if (internshipData.requiresResume && !/^https:\/\//i.test(resumeUrl.trim())) {
        throw new Error("Please provide a valid HTTPS resume link.");
    }

    const existingApplications = await getDocs(query(
        collection(db, "applications"),
        where("studentId", "==", user.uid),
    ));
    const alreadyApplied = existingApplications.docs.some(
        (application) => application.data().jobId === jobId
    );
    if (alreadyApplied) {
        throw new Error("You have already applied for this internship.");
    }

    const applicationData = {
        studentId: user.uid,
        employerId: internshipData.employerId,
        jobId,
        jobTitle: internshipData.title || "",
        company: internshipData.company || "",
        location: internshipData.location || "",
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