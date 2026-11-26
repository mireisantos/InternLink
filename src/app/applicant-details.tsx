import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { Text, TouchableOpacity, View } from "react-native";
import { db } from "../../backend/firebaseConfig.js";
import { Heading, Page, palette } from "@/components/internlink-ui";
import { fetchApplication } from "@/lib/internship-service";

export default function ApplicantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [message, setMessage] = useState("Loading applicant...");
  useEffect(() => {
    if (!id) return;
    fetchApplication(String(id)).then((application) => {
      if (application) { setItem(application); setMessage(""); }
      else setMessage("Applicant not found.");
    }).catch(() => setMessage("Unable to load applicant."));
  }, [id]);
  async function updateStatus(status: string) {
    if (!id) return;
    try {
      await updateDoc(doc(db, "applications", String(id)), { status });
      setItem((current) => current ? { ...current, status } : current);
    } catch { setMessage("Unable to update the application status. Check Firestore rules."); }
  }
  return <Page>
    <Heading title="Applicant Details" back onBack={() => router.back()} />
    {item ? <View style={{ gap: 10 }}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: "800" }}>{item.fullLegalName}</Text>
      <Text style={{ color: palette.muted }}>{item.contactEmail}</Text>
      <Text style={{ color: palette.muted }}>{item.phoneNumber}</Text>
      <Text style={{ color: palette.muted }}>{item.school} • {item.course}</Text>
      <Text style={{ color: palette.navy, fontWeight: "800" }}>Current status: {item.status || "pending"}</Text>
      {item.resumeUrl ? <Text style={{ color: palette.navy }}>Resume URL: {item.resumeUrl}</Text> : null}
      <Text style={{ color: palette.ink, fontWeight: "800", marginTop: 8 }}>Update application status</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {["under review", "interview", "accepted", "rejected"].map((status) => <TouchableOpacity key={status} onPress={() => updateStatus(status)} style={{ backgroundColor: palette.pale, padding: 10, borderRadius: 8 }}>
          <Text style={{ color: palette.navy, fontSize: 12, fontWeight: "700", textTransform: "capitalize" }}>{status}</Text>
        </TouchableOpacity>)}
      </View>
    </View> : <Text style={{ color: palette.muted }}>{message}</Text>}
    {message && item ? <Text style={{ color: palette.red, fontSize: 12 }}>{message}</Text> : null}
  </Page>;
}
