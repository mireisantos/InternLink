import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { EmptyState, Heading, Page, palette } from "@/components/internlink-ui";
import { fetchEmployerApplications } from "@/lib/internship-service";

export default function ApplicantsScreen() {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [message, setMessage] = useState("Loading applicants...");
  useEffect(() => {
    fetchEmployerApplications().then((rows) => { setItems(rows); setMessage(""); })
      .catch(() => setMessage("Sign in with an employer account to view applicants."));
  }, []);
  return <Page>
    <Heading title="Applicants" subtitle="Review applications for your internship postings." back onBack={() => router.back()} />
    {message ? <Text style={{ color: palette.muted }}>{message}</Text> : null}
    {items.length ? items.map((item) => <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: "/applicant-details", params: { id: item.id } } as any)} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 14, gap: 5 }}>
      <Text style={{ color: palette.ink, fontWeight: "800" }}>{item.fullLegalName || "Applicant"}</Text>
      <Text style={{ color: palette.muted, fontSize: 12 }}>{item.contactEmail || "No email"} • {item.course || "Course not provided"}</Text>
      <Text style={{ color: palette.navy, fontWeight: "700", fontSize: 12 }}>{item.status || "Pending"}</Text>
    </TouchableOpacity>) : !message ? <EmptyState title="No applicants yet" description="Applications submitted to your active postings will appear here." /> : null}
  </Page>;
}
