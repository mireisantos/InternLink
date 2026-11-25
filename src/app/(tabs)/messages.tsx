import { router } from "expo-router";
import { PencilLine } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { CompanyAvatar, EmptyState, Heading, Page, palette } from "@/components/internlink-ui";

const conversations = [
  { id: "sunlife", company: "SunLife", preview: "Hi! We're excited to move forward with your application.", time: "10:24 AM" },
  { id: "pspsps", company: "Pspsps Media", preview: "Thanks for your application. We'll be in touch soon.", time: "Yesterday" },
  { id: "pixel", company: "Pixel Studio", preview: "We'd like to schedule an interview.", time: "Aug 27" },
];

export default function MessagesScreen() {
  return (
    <Page>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Heading title="Messages" />
        <PencilLine size={21} color={palette.navy} />
      </View>
      {conversations.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: "/conversation", params: { id: item.id, company: item.company } } as any)}
          style={{ flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: palette.border, borderRadius: 14, padding: 12 }}>
          <CompanyAvatar name={item.company} />
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={{ color: palette.ink, fontWeight: "800", fontSize: 14 }}>{item.company}</Text>
            <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 12 }}>{item.preview}</Text>
          </View>
          <Text style={{ color: palette.muted, fontSize: 10 }}>{item.time}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ color: palette.muted, fontSize: 11, lineHeight: 17 }}>Conversation previews are sample content until messaging is connected to a Firestore message collection.</Text>
    </Page>
  );
}
