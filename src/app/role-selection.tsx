import { useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { BriefcaseBusiness, GraduationCap } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Page, palette } from "@/components/internlink-ui";

export default function RoleSelectionScreen() {
  // Navy background: use light status bar icons here, dark everywhere else.
  useFocusEffect(useCallback(() => {
    setStatusBarStyle("light");
    return () => setStatusBarStyle("dark");
  }, []));

  return (
    <Page backgroundColor={palette.navy} contentStyle={{ flex: 1, justifyContent: "center", gap: 18 }}>
      <View style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
        <GraduationCap size={48} color={palette.white} />
        <Text style={{ color: palette.white, fontSize: 25, fontWeight: "900" }}>InternLink</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/onboarding" as any)} style={{ backgroundColor: palette.white, borderRadius: 14, padding: 20, alignItems: "center", gap: 10 }}>
        <GraduationCap size={38} color={palette.navy} />
        <Text style={{ color: palette.ink, fontSize: 17, fontWeight: "800" }}>Looking for Internships?</Text>
        <Text style={{ color: palette.navy, fontWeight: "800" }}>Click Here!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: "/signup", params: { role: "employer" } } as any)} style={{ backgroundColor: palette.white, borderRadius: 14, padding: 20, alignItems: "center", gap: 10 }}>
        <BriefcaseBusiness size={38} color={palette.navy} />
        <Text style={{ color: palette.ink, fontSize: 17, fontWeight: "800" }}>Looking for Interns?</Text>
        <Text style={{ color: palette.navy, fontWeight: "800" }}>Click Here!</Text>
      </TouchableOpacity>
      <Text style={{ color: "#DCE7F5", fontSize: 11, textAlign: "center" }}>Internship-focused career discovery</Text>
    </Page>
  );
}
