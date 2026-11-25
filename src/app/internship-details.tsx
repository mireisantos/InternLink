import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { CompanyAvatar, Heading, Page, PrimaryButton, palette } from "@/components/internlink-ui";
import { fetchInternship } from "@/lib/internship-service";
import type { Internship } from "@/lib/sample-internships";

export default function InternshipDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Internship | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    fetchInternship(String(id)).then(setJob).catch(() => setError("Unable to load this internship."));
  }, [id]);
  const isSample = String(id || "").startsWith("sample-");

  if (!job) return <Page><Heading title="Internship Details" back onBack={() => router.back()} /><Text style={{ color: palette.muted }}>{error || "Loading internship..."}</Text></Page>;

  return (
    <Page>
      <Heading title="Internship Details" back onBack={() => router.back()} />
      <View style={{ backgroundColor: palette.pale, borderRadius: 14, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
        <CompanyAvatar name={job.company} size={48} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: palette.ink, fontWeight: "800", fontSize: 16 }}>{job.title}</Text>
          <Text style={{ color: palette.muted, fontSize: 12 }}>{job.company}</Text>
          <Text style={{ color: palette.muted, fontSize: 11 }}>⌖ {job.location}</Text>
          <Text style={{ color: palette.navy, fontSize: 11, fontWeight: "700" }}>{job.allowance} • {job.duration}</Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: palette.ink, fontWeight: "800", fontSize: 16 }}>About the Role</Text>
        <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>{job.description}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: palette.ink, fontWeight: "800", fontSize: 16 }}>Requirements</Text>
        {job.requirements?.map((item, index) => <Text key={index} style={{ color: palette.muted, fontSize: 13, lineHeight: 19 }}>• {item}</Text>)}
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: palette.ink, fontWeight: "800", fontSize: 16 }}>What you'll gain</Text>
        {job.benefits?.map((item, index) => <View key={index} style={{ backgroundColor: palette.pale, padding: 11, borderRadius: 8 }}><Text style={{ color: palette.navy, fontSize: 12, fontWeight: "700" }}>{item}</Text></View>)}
      </View>
      {isSample ? <Text style={{ color: palette.muted, fontSize: 11 }}>This is a sample Figma listing. Applying is available on live employer postings.</Text> :
        <PrimaryButton title="Apply Now" onPress={() => router.push({ pathname: "/apply", params: { id: job.id } } as any)} />}
    </Page>
  );
}
