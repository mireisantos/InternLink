import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Heart, Search } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { EmptyState, Heading, JobCard, Page, palette } from "@/components/internlink-ui";
import { devSampleInternships, fetchCurrentProfile, fetchInternships } from "@/lib/internship-service";
import type { Internship } from "@/lib/sample-internships";
import { toggleSavedInternship } from "../../../backend/app-tracker.js";

const categories = ["All", "Tech", "Marketing", "Design", "Business"];

export default function ExploreScreen() {
  const [jobs, setJobs] = useState<Internship[]>(devSampleInternships);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInternships().then(setJobs).catch(() => setMessage(__DEV__ ? "Unable to load live listings. Showing sample opportunities." : "Unable to load internships. Please try again later."));
    fetchCurrentProfile()
      .then((profile) => {
        const ids = profile?.savedInternships;
        if (Array.isArray(ids)) setSaved(ids.filter((id): id is string => typeof id === "string"));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => jobs.filter((job) => {
    const matchesCategory = category === "All" || String(job.category || "").trim().toLowerCase() === category.toLowerCase();
    const haystack = `${job.title} ${job.company} ${job.location} ${job.category}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  }), [jobs, category, search]);

  async function handleSave(id: string) {
    try {
      const next = await toggleSavedInternship(id);
      setSaved((current) => next ? [...current, id] : current.filter((item) => item !== id));
      setMessage(next ? "Internship saved." : "Internship removed from saved items.");
    } catch {
      setMessage("Sign in to save internships.");
    }
  }

  return (
    <Page>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Heading title="Explore Internships" />
        <TouchableOpacity onPress={() => router.push("/saved" as any)}>
          <Heart size={22} color={palette.navy} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 46, borderWidth: 1, borderColor: palette.border, borderRadius: 11, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Search size={18} color={palette.muted} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search by title, company, or skills..." placeholderTextColor={palette.muted} style={{ flex: 1, color: palette.ink, fontSize: 13 }} />
      </View>
      <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
        {categories.map((item) => (
          <TouchableOpacity key={item} onPress={() => setCategory(item)} style={{ paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, backgroundColor: category === item ? palette.navy : palette.pale }}>
            <Text style={{ color: category === item ? palette.white : palette.navy, fontSize: 12, fontWeight: "700" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: "800" }}>Featured Internships</Text>
      {message ? <Text style={{ color: palette.muted, fontSize: 12 }}>{message}</Text> : null}
      {filtered.length ? filtered.map((job) => (
        <JobCard key={job.id} title={job.title} company={job.company} location={job.location} allowance={job.allowance}
          onPress={() => router.push({ pathname: "/internship-details", params: { id: job.id } } as any)}
          right={<TouchableOpacity onPress={() => handleSave(job.id)} hitSlop={10}><Heart size={20} color={saved.includes(job.id) ? palette.red : palette.muted} fill={saved.includes(job.id) ? palette.red : "transparent"} /></TouchableOpacity>} />
      )) : <EmptyState title="No internships found" description="Try another keyword or category." />}
    </Page>
  );
}
