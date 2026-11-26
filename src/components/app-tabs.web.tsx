import type { Href } from 'expo-router';

import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

// Web-only tab bar. It sits above the screen in the normal layout, so it never
// covers page headings, and on narrow screens the tabs scroll sideways instead
// of being cut off.
export default function AppTabs() {
  return (
    <Tabs>
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href={"/home" as Href} asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>

          <TabTrigger name="explore" href={"/explore" as Href} asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
          <TabTrigger name="applications" href={"/applications" as Href} asChild>
            <TabButton>Applications</TabButton>
          </TabTrigger>
          <TabTrigger name="messages" href={"/messages" as Href} asChild>
            <TabButton>Messages</TabButton>
          </TabTrigger>
          <TabTrigger name="profile" href={"/profile" as Href} asChild>
            <TabButton>Profile</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>

      <TabSlot style={{ flex: 1 }} />
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ref: _ref,
  ...props
}: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}
      >
        <ThemedText
          type="small"
          themeColor={isFocused ? 'text' : 'textSecondary'}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { width } = useWindowDimensions();
  // The brand label only fits next to all five tabs on wider screens.
  const showBrand = width >= 640;

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {showBrand ? (
          <ThemedText type="smallBold">
            InternLink
          </ThemedText>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={[
            styles.tabs,
            { justifyContent: showBrand ? 'flex-end' : 'center' },
          ]}
        >
          {props.children}
        </ScrollView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    width: '100%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
  },

  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },

  tabsScroll: {
    flex: 1,
  },

  // flexGrow lets justifyContent centre or right-align the tabs when they fit;
  // when they don't fit, the row is as wide as its content and scrolls.
  tabs: {
    flexGrow: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },

  pressed: {
    opacity: 0.7,
  },

  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },

});
