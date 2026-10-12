import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import {auth, db} from "./firebaseConfig";

export async function postInternship({
    title,
    company,
    location,
    duration,
    allowance,
    description,
    category,
    requirements,
    benefits,
    requiresResume,
}) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in to post an internship.");
    }

    if (!title?.trim()) {
        throw new Error("Internship title is required.");
    }

    if (!company?.trim()) {
        throw new Error("Company name is required.");
    }

    if (!location?.trim()) {
        throw new Error("Location is required.");
    }

    if(!allowance?.trim()){
        throw new Error("Allowance is required.");
    }

    if (!description?.trim()) {
        throw new Error("Description is required.");
    }

    if (!category?.trim()) {
        throw new Error("Category is required.");
    }

    if(
        !array.isArray(requirements) ||
        !requirements.every((item) => typeof item === "string")
    )

    if(
        !array.isArray(benefits) ||
        !benefits.every((item) => typeof item === "string")
    ) {
        throw new Error("Benefits must be an array of strings.");
    }

    if (typeof requiresResume !== "boolean") {
        throw new Error("Resume Requirement must be a boolean value.");
    }

    const internshipData = {
        employerId: user.uid,
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        duration: duration?.trim() || null,
        allowance: allowance.trim(),
        description: description.trim(),
        category: category.trim(),
        requirements,
        benefits,
        requiresResume,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
    };

    const internshipRef = await addDoc(
        collection(db, "internships"),
        internshipData
    );

    return internshipRef.id;
}