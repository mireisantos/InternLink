import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Heading, Page, palette } from "@/components/internlink-ui";
import { fetchApplication } from "@/lib/internship-service";

export default function ApplicationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [message, setMessage] = useState("Loading application...");
  useEffect(() => {
    if (!id) return;
    fetchApplication(String(id)).then((application) => {
      if (application) { setData(application); setMessage(""); }
      else setMessage("Application not found.");
    }).catch(() => setMessage("Unable to load application."));
  }, [id]);
  return <Page>
    <Heading title="Application Details" back onBack={() => router.back()} />
    {data ? <View style={{ gap: 12, borderWidth: 1, borderColor: palette.border, borderRadius: 14, padding: 15 }}>
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: "800" }}>{data.jobTitle || data.jobId || "Internship Application"}</Text>
      <Text style={{ color: palette.navy, fontWeight: "800" }}>Status: {data.status || "Pending"}</Text>
      <Text style={{ color: palette.muted }}>Applicant: {data.fullLegalName}</Text>
      <Text style={{ color: palette.muted }}>Email: {data.contactEmail}</Text>
      <Text style={{ color: palette.muted }}>School: {data.school}</Text>
      <Text style={{ color: palette.muted }}>Course: {data.course}</Text>
      {data.resumeUrl ? <Text style={{ color: palette.navy }}>Resume: {data.resumeUrl}</Text> : null}
    </View> : <Text style={{ color: palette.muted }}>{message}</Text>}
  </Page>;
}
