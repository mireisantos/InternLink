import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import { Field, Heading, Page, PrimaryButton, palette } from "@/components/internlink-ui";
import { fetchCurrentProfile, updateCurrentProfile } from "@/lib/internship-service";

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetchCurrentProfile().then((profile) => {
      setFullName(String(profile?.fullName || ""));
      setSchool(String(profile?.school || ""));
      setCourse(String(profile?.course || ""));
      setPhoneNumber(String(profile?.phoneNumber || ""));
    }).catch(() => setMessage("Sign in to edit your profile."));
  }, []);
  async function save() {
    if (!fullName.trim()) { setMessage("Please enter your full name."); return; }
    try {
      setBusy(true); setMessage("");
      await updateCurrentProfile({ fullName, school, course, phoneNumber });
      router.back();
    } catch (error: any) { setMessage(error?.message || "Unable to save your profile."); }
    finally { setBusy(false); }
  }
  return <Page>
    <Heading title="Edit Profile" back onBack={() => router.back()} />
    <Field label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your full name" />
    <Field label="School" value={school} onChangeText={setSchool} placeholder="Your school" />
    <Field label="Course" value={course} onChangeText={setCourse} placeholder="Your course" />
    <Field label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+63..." keyboardType="phone-pad" />
    {message ? <Text style={{ color: palette.red, fontSize: 12 }}>{message}</Text> : null}
    <PrimaryButton title={busy ? "Saving..." : "Save Changes"} onPress={save} disabled={busy} />
  </Page>;
}
