import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";
import { Heading, Page, palette } from "@/components/internlink-ui";

export default function NotificationsScreen() {
  return <Page>
    <Heading title="Notifications" back onBack={() => router.back()} />
    <View style={{ alignItems: "center", paddingVertical: 45, gap: 10 }}>
      <Bell size={42} color={palette.navy} />
      <Text style={{ color: palette.ink, fontSize: 17, fontWeight: "800" }}>{"You're all caught up"}</Text>
      <Text style={{ color: palette.muted, textAlign: "center", fontSize: 13, lineHeight: 19 }}>Application updates and messages will appear here when notification records are connected.</Text>
    </View>
  </Page>;
}
