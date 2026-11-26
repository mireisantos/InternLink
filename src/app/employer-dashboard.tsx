import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Heading, Page, PrimaryButton, palette } from "@/components/internlink-ui";
import { fetchEmployerApplications, fetchEmployerInternships } from "@/lib/internship-service";
import type { Internship } from "@/lib/sample-internships";

export default function EmployerDashboardScreen() {
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [applicantCount, setApplicantCount] = useState(0);
  const [message, setMessage] = useState("Loading employer workspace...");
  useEffect(() => {
    Promise.all([fetchEmployerInternships(), fetchEmployerApplications()])
      .then(([postings, applications]) => { setJobs(postings); setApplicantCount(applications.length); setMessage(""); })
      .catch(() => setMessage("Sign in with an employer account to access these tools."));
  }, []);
  return <Page>
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Heading title="Employer Dashboard" subtitle="Manage your internship opportunities and applicants." />
      </View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Settings" hitSlop={10} onPress={() => router.push("/settings" as any)}>
        <Settings size={22} color={palette.navy} />
      </TouchableOpacity>
    </View>
    <View style={{ flexDirection: "row", gap: 10 }}>
      <View style={{ flex: 1, backgroundColor: palette.pale, padding: 15, borderRadius: 12 }}>
        <Text style={{ color: palette.navy, fontSize: 23, fontWeight: "900" }}>{jobs.length}</Text>
        <Text style={{ color: palette.muted, fontSize: 11 }}>Posted internships</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: palette.pale, padding: 15, borderRadius: 12 }}>
        <Text style={{ color: palette.navy, fontSize: 23, fontWeight: "900" }}>{applicantCount}</Text>
        <Text style={{ color: palette.muted, fontSize: 11 }}>Applications received</Text>
      </View>
    </View>
    <PrimaryButton title="Post an Internship" onPress={() => router.push("/post-internship" as any)} />
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: "800" }}>Your Job Postings</Text>
      <TouchableOpacity onPress={() => router.push("/applicants" as any)}><Text style={{ color: palette.navy, fontWeight: "700", fontSize: 12 }}>View applicants</Text></TouchableOpacity>
    </View>
    {message ? <Text style={{ color: palette.muted, fontSize: 12 }}>{message}</Text> : null}
    {jobs.map((job) => <TouchableOpacity key={job.id} onPress={() => router.push("/applicants" as any)} style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 14, gap: 5 }}>
      <Text style={{ color: palette.ink, fontWeight: "800" }}>{job.title}</Text>
      <Text style={{ color: palette.muted, fontSize: 12 }}>{job.location} • {job.isActive ? "Active" : "Inactive"}</Text>
    </TouchableOpacity>)}
  </Page>;
}
