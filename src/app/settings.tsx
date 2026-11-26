import { router } from "expo-router";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../backend/firebaseConfig.js";
import { Heading, Page, palette } from "@/components/internlink-ui";
import { fetchCurrentProfile } from "@/lib/internship-service";
import { useEffect, useState } from "react";

export default function SettingsScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { fetchCurrentProfile().then((profile) => setEmail(String(profile?.email || auth.currentUser?.email || ""))).catch(() => {}); }, []);
  async function resetPassword() {
    if (!email) { setMessage("No email address is available for this account."); return; }
    try { await sendPasswordResetEmail(auth, email); setMessage("Password reset instructions were sent to your email."); }
    catch { setMessage("Unable to send a password reset email."); }
  }
  async function logout() {
    try { await signOut(auth); router.replace("/" as any); }
    catch { setMessage("Unable to sign out. Please try again."); }
  }
  return <Page>
    <Heading title="Settings" back onBack={() => router.back()} />
    <TouchableOpacity onPress={resetPassword} style={row}><Text style={rowTitle}>Change Password</Text><Text style={rowHint}>Send a password reset link to {email || "your email"}</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/notifications" as any)} style={row}><Text style={rowTitle}>Notifications</Text><Text style={rowHint}>Manage notification preferences</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => setMessage("Help and support: contact your InternLink administrator.")} style={row}><Text style={rowTitle}>Help & Support</Text><Text style={rowHint}>Get help with your account</Text></TouchableOpacity>
    {message ? <Text style={{ color: palette.navy, fontSize: 12 }}>{message}</Text> : null}
    <TouchableOpacity onPress={logout} style={[row, { borderColor: palette.red }]}><Text style={[rowTitle, { color: palette.red }]}>Sign Out</Text></TouchableOpacity>
  </Page>;
}
const row = { borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 15, gap: 5 } as const;
const rowTitle = { color: palette.ink, fontSize: 14, fontWeight: "800" as const };
const rowHint = { color: palette.muted, fontSize: 11 };
