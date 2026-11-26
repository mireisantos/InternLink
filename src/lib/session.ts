import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, type Href } from "expo-router";

/**
 * Clear the navigation history and show `href`, so the Android back button
 * can't return to screens from before a sign-in or sign-out.
 */
export function resetTo(href: Href) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(href);
}

const REMEMBER_ME_KEY = "internlink.rememberMe";

/** Called after a successful login with the state of the "Remember me" checkbox. */
export async function setRememberMe(remember: boolean) {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, remember ? "1" : "0");
}

/** True when the user logged in with "Remember me" unticked, so the saved session should not be reused. */
export async function shouldForgetSession() {
  return (await AsyncStorage.getItem(REMEMBER_ME_KEY)) === "0";
}
