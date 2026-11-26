import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { applyForInternship } from "../../backend/internship-app.js";
import { Field, Heading, Page, PrimaryButton, palette } from "@/components/internlink-ui";
import { fetchInternship } from "@/lib/internship-service";
import type { Internship } from "@/lib/sample-internships";

export default function ApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Internship | null>(null);
  const [fullLegalName, setFullLegalName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { if (id) fetchInternship(String(id)).then(setJob).catch(() => setMessage("Unable to load internship.")); }, [id]);

  async function submit() {
    if (!job || String(id).startsWith("sample-")) {
      setMessage("This sample listing is for design preview only. Apply to a live employer posting.");
      return;
    }
    try {
      setBusy(true); setMessage("");
      await applyForInternship({ jobId: String(id), fullLegalName, contactEmail, phoneNumber, school, course, resumeUrl });
      router.replace("/(tabs)/applications" as any);
    } catch (error: any) {
      setMessage(error?.message || "Unable to submit your application.");
    } finally { setBusy(false); }
  }

  return (
    <Page>
      <Heading title="Apply for Internship" back onBack={() => router.back()} />
      {job ? <View style={{ backgroundColor: palette.pale, padding: 13, borderRadius: 12, gap: 4 }}>
        <Text style={{ color: palette.ink, fontWeight: "800" }}>{job.title}</Text>
        <Text style={{ color: palette.muted, fontSize: 12 }}>{job.company} • {job.location}</Text>
      </View> : null}
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: "800" }}>Personal Information</Text>
      <Field label="Full Name" value={fullLegalName} onChangeText={setFullLegalName} placeholder="Enter your full legal name" />
      <Field label="Email Address" value={contactEmail} onChangeText={setContactEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
      <Field label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+63 912 345 6789" keyboardType="phone-pad" />
      <Field label="School" value={school} onChangeText={setSchool} placeholder="Your school" />
      <Field label="Course" value={course} onChangeText={setCourse} placeholder="Your course" />
      {job?.requiresResume ? <View style={{ gap: 7 }}>
        <Text style={{ color: palette.ink, fontWeight: "800" }}>Required Document</Text>
        <Text style={{ color: palette.muted, fontSize: 12 }}>This posting requires a resume. Paste a shareable resume URL below. File upload setup is not yet configured.</Text>
        <Field label="Resume URL" value={resumeUrl} onChangeText={setResumeUrl} placeholder="https://..." autoCapitalize="none" />
      </View> : <Text style={{ color: palette.green, backgroundColor: palette.pale, padding: 12, borderRadius: 9, fontSize: 12 }}>No CV / Resume required for this posting.</Text>}
      {message ? <Text style={{ color: palette.red, fontSize: 12 }}>{message}</Text> : null}
      <PrimaryButton title={busy ? "Submitting..." : "Submit Application"} onPress={submit} disabled={busy || !job} />
    </Page>
  );
}
