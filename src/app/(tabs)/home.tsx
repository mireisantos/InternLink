import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ArrowRight, GraduationCap, Search } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { EmptyState, Heading, JobCard, Page, palette } from "@/components/internlink-ui";
import { fetchCurrentProfile, fetchInternships } from "@/lib/internship-service";
import type { Internship } from "@/lib/sample-internships";

export default function HomeScreen() {
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [name, setName] = useState("there");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([fetchInternships(), fetchCurrentProfile()])
      .then(([items, profile]) => {
        if (!active) return;
        setJobs(items.slice(0, 3));
        setName(String(profile?.fullName || "there").split(" ")[0]);
      })
      .catch(() => {
        if (active) setJobs([]);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <Page>
      <View style={{ gap: 2 }}>
        <Text style={{ color: palette.muted, fontSize: 14 }}>Good morning,</Text>
        <Text style={{ color: palette.ink, fontSize: 25, fontWeight: "800" }}>{name} 👋</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/explore" as any)}
        style={{ borderWidth: 1, borderColor: palette.border, borderRadius: 12, paddingHorizontal: 13, height: 46, flexDirection: "row", alignItems: "center", gap: 9 }}
      >
        <Search size={18} color={palette.muted} />
        <Text style={{ color: palette.muted, fontSize: 13 }}>Search internships...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/explore" as any)}
        style={{ backgroundColor: palette.navy, borderRadius: 15, padding: 18, flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={{ color: palette.white, fontSize: 22, fontWeight: "800" }}>Your next step{"\n"}starts here.</Text>
          <Text style={{ color: "#D9E5F5", fontSize: 12, lineHeight: 18 }}>Explore internships, build your skills, and get closer to your goals.</Text>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: palette.white, alignItems: "center", justifyContent: "center" }}>
          <ArrowRight size={21} color={palette.navy} />
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Heading title="Recommended for you" />
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore" as any)}>
          <Text style={{ color: palette.navy, fontWeight: "700", fontSize: 12 }}>See all</Text>
        </TouchableOpacity>
      </View>

      {loading ? <Text style={{ color: palette.muted }}>Loading internships...</Text> :
        jobs.length ? jobs.map((job) => (
          <JobCard key={job.id} title={job.title} company={job.company} location={job.location}
            allowance={job.allowance} onPress={() => router.push({ pathname: "/internship-details", params: { id: job.id } } as any)} />
        )) : <EmptyState title="No internships yet" description="New opportunities will appear here when employers publish their listings." />}

      <View style={{ backgroundColor: palette.pale, borderRadius: 13, padding: 16, gap: 7 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <GraduationCap size={19} color={palette.navy} />
          <Text style={{ color: palette.navy, fontWeight: "800" }}>Why InternLink?</Text>
        </View>
        <Text style={{ color: palette.ink, fontWeight: "700", fontSize: 13 }}>Internship-first</Text>
        <Text style={{ color: palette.muted, fontSize: 12, lineHeight: 18 }}>Track applications, interviews, and offers in one place.</Text>
      </View>
    </Page>
  );
}
