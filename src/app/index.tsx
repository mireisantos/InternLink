import { useEffect, useState } from "react";
import { Redirect, type Href } from "expo-router";
import { signOut } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { auth, firebaseReady } from "../../backend/firebaseConfig.js";
import { palette } from "@/components/internlink-ui";
import { fetchCurrentProfile } from "@/lib/internship-service";
import { shouldForgetSession } from "@/lib/session";

// Firebase restores a saved login asynchronously, so wait for it before
// choosing where to send the user.
async function resolveStartRoute(): Promise<Href> {
  if (!firebaseReady) return "/role-selection" as Href;
  await auth.authStateReady();
  if (!auth.currentUser) return "/role-selection" as Href;
  if (await shouldForgetSession()) {
    await signOut(auth);
    return "/role-selection" as Href;
  }
  const profile = await fetchCurrentProfile();
  if (!profile) return "/role-selection" as Href;
  return (profile.role === "employer" ? "/employer-dashboard" : "/home") as Href;
}

export default function IndexScreen() {
  const [target, setTarget] = useState<Href | null>(null);

  useEffect(() => {
    let active = true;
    resolveStartRoute()
      .catch(() => "/role-selection" as Href)
      .then((route) => { if (active) setTarget(route); });
    return () => { active = false; };
  }, []);

  if (target) return <Redirect href={target} />;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: palette.navy }}>
      <ActivityIndicator color={palette.white} />
    </View>
  );
}
