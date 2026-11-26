import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Bell, ChevronRight, Heart, Settings, Square, UserRoundPen } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { CompanyAvatar, Heading, Page, palette } from "@/components/internlink-ui";
import { fetchCurrentProfile } from "@/lib/internship-service";

const menuItems = [
  { title: "My Profile", icon: UserRoundPen, route: "/edit-profile" },
  { title: "My Applications", icon: Square, route: "/(tabs)/applications" },
  { title: "Saved Internships", icon: Heart, route: "/saved" },
  { title: "Notifications", icon: Bell, route: "/notifications" },
  { title: "Settings", icon: Settings, route: "/settings" },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  useEffect(() => { fetchCurrentProfile().then(setProfile).catch(() => setProfile(null)); }, []);
  const fullName = String(profile?.fullName || "Your name");
  const email = String(profile?.email || "");
  const initials = fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Page>
      <Heading title="Profile" />
      <View style={{ alignItems: "center", gap: 7, paddingVertical: 12 }}>
        <CompanyAvatar name={initials || "U"} size={86} />
        <Text style={{ color: palette.ink, fontSize: 20, fontWeight: "800" }}>{fullName}</Text>
        <Text style={{ color: palette.muted, fontSize: 12 }}>{email}</Text>
        <Text style={{ color: palette.muted, fontSize: 11 }}>{[profile?.course, profile?.school].filter(Boolean).join(" • ") || "Complete your student profile"}</Text>
      </View>
      <View style={{ gap: 10 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity key={item.title} onPress={() => router.push(item.route as any)}
              style={{ height: 54, borderWidth: 1, borderColor: palette.border, borderRadius: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
                <Icon size={19} color={palette.navy} />
                <Text style={{ color: palette.ink, fontWeight: "700", fontSize: 13 }}>{item.title}</Text>
              </View>
              <ChevronRight size={19} color={palette.muted} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ backgroundColor: palette.pale, borderRadius: 13, padding: 16, gap: 8 }}>
        <Text style={{ color: palette.navy, fontWeight: "800", fontSize: 12 }}>Internship profile strength</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <View style={{ flex: 1, height: 7, borderRadius: 8, backgroundColor: palette.white, overflow: "hidden" }}>
            <View style={{ width: `${Math.max(0, Math.min(100, Number(profile?.profileStrength || 0)))}%`, height: "100%", backgroundColor: palette.navy }} />
          </View>
          <Text style={{ color: palette.navy, fontWeight: "800", fontSize: 11 }}>{Math.max(0, Math.min(100, Number(profile?.profileStrength || 0)))}%</Text>
        </View>
      </View>
      {profile?.role === "employer" ? (
        <TouchableOpacity onPress={() => router.push("/employer-dashboard" as any)} style={{ padding: 14, backgroundColor: palette.pale, borderRadius: 12 }}>
          <Text style={{ color: palette.navy, fontWeight: "800" }}>Employer tools</Text>
          <Text style={{ color: palette.muted, fontSize: 12, marginTop: 4 }}>Manage internship postings and applicants.</Text>
        </TouchableOpacity>
      ) : null}
    </Page>
  );
}
