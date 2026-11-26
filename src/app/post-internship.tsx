import { useState } from "react";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { postInternship } from "../../backend/internship-posting.js";
import { Field, Heading, Page, PrimaryButton, palette } from "@/components/internlink-ui";

export default function PostInternshipScreen() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [allowance, setAllowance] = useState("");
  const [category, setCategory] = useState("Tech");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [requiresResume, setRequiresResume] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function publish() {
    try {
      setBusy(true); setMessage("");
      await postInternship({
        title, company, location, duration, allowance, description, category,
        requirements: requirements.split("\n").map((item) => item.trim()).filter(Boolean),
        benefits: benefits.split("\n").map((item) => item.trim()).filter(Boolean),
        requiresResume,
      });
      router.replace("/employer-dashboard" as any);
    } catch (error: any) { setMessage(error?.message || "Unable to publish this internship."); }
    finally { setBusy(false); }
  }

  return <Page>
    <Heading title="Post Internship" subtitle="Share an opportunity with students." back onBack={() => router.back()} />
    <Text style={{ color: palette.ink, fontSize: 16, fontWeight: "800" }}>Job Posting Details</Text>
    <Field label="Internship Title" value={title} onChangeText={setTitle} placeholder="e.g. Software Engineering Intern" />
    <Field label="Company" value={company} onChangeText={setCompany} placeholder="Company name" />
    <Field label="Location" value={location} onChangeText={setLocation} placeholder="City • On-site / Hybrid / Remote" />
    <Field label="Duration" value={duration} onChangeText={setDuration} placeholder="e.g. 3 months" />
    <Field label="Allowance" value={allowance} onChangeText={setAllowance} placeholder="e.g. ₱8,000 / month" />
    <Field label="Category" value={category} onChangeText={setCategory} placeholder="Tech, Marketing, Design..." />
    <Field label="Description" value={description} onChangeText={setDescription} placeholder="Describe the internship role..." multiline />
    <Field label="Requirements (one per line)" value={requirements} onChangeText={setRequirements} placeholder={"Currently enrolled student\nBasic knowledge of the field"} multiline />
    <Field label="Benefits (one per line)" value={benefits} onChangeText={setBenefits} placeholder={"Mentorship\nHands-on experience"} multiline />
    <View style={{ backgroundColor: palette.pale, borderRadius: 12, padding: 13, gap: 10 }}>
      <Text style={{ color: palette.ink, fontWeight: "800" }}>Application Requirements</Text>
      <Text style={{ color: palette.muted, fontSize: 12 }}>Does this posting require a CV / Resume?</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[true, false].map((value) => <TouchableOpacity key={String(value)} onPress={() => setRequiresResume(value)} style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: requiresResume === value ? palette.navy : palette.white }}>
          <Text style={{ color: requiresResume === value ? palette.white : palette.navy, textAlign: "center", fontWeight: "700", fontSize: 12 }}>{value ? "Required" : "Not required"}</Text>
        </TouchableOpacity>)}
      </View>
    </View>
    {message ? <Text style={{ color: palette.red, fontSize: 12 }}>{message}</Text> : null}
    <PrimaryButton title={busy ? "Publishing..." : "Publish Internship"} onPress={publish} disabled={busy} />
  </Page>;
}
