import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../backend/firebaseConfig.js";
import { sampleInternships, type Internship } from "./sample-internships";

// Sample listings help while developing, but must never be shown to real users.
export const devSampleInternships: Internship[] = __DEV__ ? sampleInternships : [];

export async function fetchInternships(): Promise<Internship[]> {
  const snapshot = await getDocs(collection(db, "internships"));
  const live = snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((item: any) => item.isActive === true) as Internship[];
  return live.length ? live : devSampleInternships;
}

export async function fetchInternship(id: string): Promise<Internship | null> {
  const sample = devSampleInternships.find((item) => item.id === id);
  if (sample) return sample;
  const snapshot = await getDoc(doc(db, "internships", id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Internship) : null;
}

export async function fetchApplication(id: string): Promise<Record<string, any> | null> {
  const snapshot = await getDoc(doc(db, "applications", id));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function fetchCurrentProfile(): Promise<Record<string, any> | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const snapshot = await getDoc(doc(db, "users", user.uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function updateCurrentProfile(values: {
  fullName: string;
  school?: string;
  course?: string;
  phoneNumber?: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again.");
  const profileStrength = [
    values.fullName,
    values.school,
    values.course,
    values.phoneNumber,
  ].filter((value) => Boolean(value?.trim())).length * 25;

  await updateDoc(doc(db, "users", user.uid), {
    ...values,
    profileStrength,
    updatedAt: serverTimestamp(),
  });
}

export async function fetchSavedInternships(): Promise<Internship[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to view saved internships.");
  const profile = await getDoc(doc(db, "users", user.uid));
  if (!profile.exists()) return [];
  const ids = (profile.data().savedInternships || []) as string[];
  const items = await Promise.all(ids.map((id) => fetchInternship(id)));
  return items.filter((item): item is Internship => item !== null);
}

export async function fetchEmployerInternships(): Promise<Internship[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");
  const snapshot = await getDocs(query(
    collection(db, "internships"),
    where("employerId", "==", user.uid),
  ));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Internship));
}

export async function fetchEmployerApplications() {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");
  const snapshot = await getDocs(query(
    collection(db, "applications"),
    where("employerId", "==", user.uid),
  ));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function fetchStudentApplications() {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");
  const snapshot = await getDocs(query(
    collection(db, "applications"),
    where("studentId", "==", user.uid),
  ));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
