import { useEffect, useState } from "react";
import { router } from "expo-router";
import { fetchSavedInternships } from "@/lib/internship-service";
import { EmptyState, Heading, JobCard, Page, palette } from "@/components/internlink-ui";
import type { Internship } from "@/lib/sample-internships";
import { Text } from "react-native";

export default function SavedScreen() {
  const [items, setItems] = useState<Internship[]>([]);
  const [message, setMessage] = useState("Loading saved internships...");
  useEffect(() => {
    fetchSavedInternships().then((rows) => { setItems(rows); setMessage(""); })
      .catch(() => setMessage("Sign in to view your saved internships."));
  }, []);
  return <Page>
    <Heading title="Saved Internships" back onBack={() => router.back()} />
    {message ? <Text style={{ color: palette.muted }}>{message}</Text> : null}
    {items.length ? items.map((job) => <JobCard key={job.id} title={job.title} company={job.company} location={job.location} allowance={job.allowance} onPress={() => router.push({ pathname: "/internship-details", params: { id: job.id } } as any)} />)
      : !message ? <EmptyState title="No saved internships" description="Tap the heart on an internship to save it for later." /> : null}
  </Page>;
}
