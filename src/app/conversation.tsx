import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { CompanyAvatar, Heading, Page, palette } from "@/components/internlink-ui";

export default function ConversationScreen() {
  const { company } = useLocalSearchParams<{ company: string }>();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", from: "them", text: "Hi! Thank you for your interest. We have received your application." },
    { id: "2", from: "me", text: "Thank you for the update. I look forward to hearing from you." },
  ]);
  function send() {
    if (!draft.trim()) return;
    setMessages((current) => [...current, { id: String(Date.now()), from: "me", text: draft.trim() }]);
    setDraft("");
  }
  return <Page contentStyle={{ flex: 1 }}>
    <Heading title={company || "Conversation"} back onBack={() => router.back()} />
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: palette.pale, padding: 12, borderRadius: 12 }}>
      <CompanyAvatar name={company || "Company"} />
      <View><Text style={{ color: palette.ink, fontWeight: "800" }}>{company || "Company"}</Text><Text style={{ color: palette.muted, fontSize: 11 }}>InternLink conversation</Text></View>
    </View>
    <View style={{ flex: 1, gap: 12, paddingVertical: 10 }}>
      {messages.map((item) => <View key={item.id} style={{ alignSelf: item.from === "me" ? "flex-end" : "flex-start", maxWidth: "82%", backgroundColor: item.from === "me" ? palette.navy : palette.pale, padding: 12, borderRadius: 13 }}>
        <Text style={{ color: item.from === "me" ? palette.white : palette.ink, fontSize: 13, lineHeight: 19 }}>{item.text}</Text>
      </View>)}
    </View>
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center", borderWidth: 1, borderColor: palette.border, borderRadius: 12, paddingHorizontal: 12 }}>
      <TextInput value={draft} onChangeText={setDraft} placeholder="Write a message..." placeholderTextColor={palette.muted} style={{ flex: 1, minHeight: 44, color: palette.ink }} />
      <TouchableOpacity onPress={send}><Send size={19} color={palette.navy} /></TouchableOpacity>
    </View>
    <Text style={{ color: palette.muted, fontSize: 10 }}>Messages are currently local preview content and are not sent or saved to Firestore.</Text>
  </Page>;
}
