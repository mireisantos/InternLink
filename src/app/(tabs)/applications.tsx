import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { EmptyState, Heading, Page, palette } from "@/components/internlink-ui";
import { fetchStudentApplications } from "@/lib/internship-service";

type Application = {
  id: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  status?: string;
  fullLegalName?: string;
  appliedAt?: any;
};

export default function ApplicationsScreen() {
  const [items, setItems] = useState<Application[]>([]);
  const [tab, setTab] = useState<"Active" | "Past">("Active");
  const [message, setMessage] = useState("Loading your applications...");

  // Reload whenever the tab is shown, e.g. right after submitting an application.
  useFocusEffect(useCallback(() => {
    let active = true;
    fetchStudentApplications()
      .then((rows) => { if (active) { setItems(rows as Application[]); setMessage(""); } })
      .catch(() => { if (active) setMessage("Sign in to view your applications."); });
    return () => { active = false; };
  }, []));

  const visible = items.filter((item) => {
    const status = String(item.status || "pending").toLowerCase();
    const past = ["rejected", "accepted", "withdrawn"].includes(status);
    return tab === "Past" ? past : !past;
  });

  return (
    <Page>
      <Heading title="My Applications" />
      <View style={{ flexDirection: "row", backgroundColor: palette.pale, borderRadius: 22, padding: 4 }}>
        {(["Active", "Past"] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setTab(item)} style={{ flex: 1, padding: 10, borderRadius: 20, backgroundColor: tab === item ? palette.navy : "transparent", alignItems: "center" }}>
            <Text style={{ color: tab === item ? palette.white : palette.navy, fontWeight: "700" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {message ? <Text style={{ color: palette.muted, fontSize: 13 }}>{message}</Text> : null}
      {visible.length ? visible.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: "/application-details", params: { id: item.id } } as any)} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 14, padding: 15, gap: 7 }}>
          <Text style={{ color: palette.ink, fontWeight: "800" }}>{item.jobTitle || item.jobId || "Internship application"}</Text>
          <Text style={{ color: palette.muted, fontSize: 12 }}>{item.company || "Employer"} • Applied through InternLink</Text>
          <View style={{ alignSelf: "flex-start", backgroundColor: palette.pale, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: palette.navy, fontWeight: "700", fontSize: 11, textTransform: "capitalize" }}>{item.status || "Pending"}</Text>
          </View>
        </TouchableOpacity>
      )) : !message ? <EmptyState title={tab === "Active" ? "No active applications" : "No past applications"} description="When you apply for an internship, its progress will appear here." action={<TouchableOpacity onPress={() => router.push("/(tabs)/explore" as any)}><Text style={{ color: palette.navy, fontWeight: "800" }}>Explore internships</Text></TouchableOpacity>} /> : null}
      <View style={{ backgroundColor: palette.pale, borderRadius: 12, padding: 15, gap: 5 }}>
        <Text style={{ color: palette.navy, fontWeight: "800" }}>Application tip</Text>
        <Text style={{ color: palette.muted, fontSize: 12 }}>Keep your profile and resume updated to improve your application readiness.</Text>
      </View>
    </Page>
  );
}
