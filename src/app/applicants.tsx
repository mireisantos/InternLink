import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { EmptyState, Heading, Page, palette } from "@/components/internlink-ui";
import { fetchEmployerApplications } from "@/lib/internship-service";

export default function ApplicantsScreen() {
  // Optional: opened from a specific job on the employer dashboard.
  const { jobId, title } = useLocalSearchParams<{ jobId?: string; title?: string }>();
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [message, setMessage] = useState("Loading applicants...");

  // Reload whenever the list is shown, e.g. after changing an applicant's status.
  useFocusEffect(useCallback(() => {
    let active = true;
    fetchEmployerApplications()
      .then((rows) => {
        if (!active) return;
        setItems(jobId ? rows.filter((row: Record<string, any>) => row.jobId === jobId) : rows);
        setMessage("");
      })
      .catch(() => { if (active) setMessage("Sign in with an employer account to view applicants."); });
    return () => { active = false; };
  }, [jobId]));

  return <Page>
    <Heading
      title="Applicants"
      subtitle={title ? `Applications for ${title}` : "Review applications for your internship postings."}
      back
      onBack={() => router.back()}
    />
    {message ? <Text style={{ color: palette.muted }}>{message}</Text> : null}
    {items.length ? items.map((item) => <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: "/applicant-details", params: { id: item.id } } as any)} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 14, gap: 5 }}>
      <Text style={{ color: palette.ink, fontWeight: "800" }}>{item.fullLegalName || "Applicant"}</Text>
      <Text style={{ color: palette.muted, fontSize: 12 }}>{item.contactEmail || "No email"} • {item.course || "Course not provided"}</Text>
      <Text style={{ color: palette.navy, fontWeight: "700", fontSize: 12 }}>{item.status || "Pending"}</Text>
    </TouchableOpacity>) : !message ? <EmptyState title="No applicants yet" description={jobId ? "No one has applied to this internship yet." : "Applications submitted to your active postings will appear here."} /> : null}
  </Page>;
}
