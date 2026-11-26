import { router } from "expo-router";
import { GraduationCap } from "lucide-react-native";
import { Text, View } from "react-native";
import { Page, PrimaryButton, palette } from "@/components/internlink-ui";

export default function OnboardingScreen() {
  return (
    <Page contentStyle={{ flex: 1, justifyContent: "space-between", paddingTop: 70, paddingBottom: 42 }}>
      <View style={{ alignItems: "center", gap: 10 }}>
        <GraduationCap size={44} color={palette.navy} />
        <Text style={{ color: palette.navy, fontSize: 22, fontWeight: "900" }}>InternLink</Text>
      </View>
      <View style={{ alignItems: "center", gap: 16, paddingHorizontal: 12 }}>
        <View style={{ width: 190, height: 190, borderRadius: 24, backgroundColor: palette.pale, alignItems: "center", justifyContent: "center" }}>
          <GraduationCap size={76} color={palette.navy} />
        </View>
        <View style={{ alignItems: "center", gap: 7 }}>
          <Text style={{ color: palette.ink, fontSize: 21, fontWeight: "800" }}>Built for students</Text>
          <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 19, textAlign: "center" }}>
            Discover opportunities matched to your course, skills, schedule, and goals.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 7 }}>
          <View style={{ width: 16, height: 6, borderRadius: 3, backgroundColor: palette.navy }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.border }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.border }} />
        </View>
      </View>
      <PrimaryButton title="Get Started" onPress={() => router.replace("/login" as any)} />
    </Page>
  );
}
