import type { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

export const palette = {
  navy: "#082B5F",
  navyDark: "#06224D",
  ink: "#172B4D",
  muted: "#7889A3",
  border: "#D8E2F0",
  pale: "#E8F0FA",
  white: "#FFFFFF",
  green: "#198B62",
  amber: "#E59A00",
  red: "#CC4949",
  background: "#F8FAFD",
};

export function Page({
  children,
  scroll = true,
  contentStyle,
  backgroundColor = palette.white,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  backgroundColor?: string;
}) {
  return (
    <SafeAreaView style={[styles.page, { backgroundColor }]}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Heading({
  title,
  subtitle,
  back,
  onBack,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
}) {
  return (
    <View style={styles.heading}>
      {back ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.headingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        secondary && styles.secondaryButton,
        disabled && { opacity: 0.55 },
      ]}
    >
      <Text style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Field({
  label,
  style,
  multiline,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={palette.muted}
        style={[styles.input, multiline && styles.multiline, style]}
      />
    </View>
  );
}

export function CompanyAvatar({ name, size = 42 }: { name: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ color: palette.white, fontSize: size * 0.45, fontWeight: "800" }}>
        {(name.trim()[0] || "I").toUpperCase()}
      </Text>
    </View>
  );
}

export function JobCard({
  title,
  company,
  location,
  allowance,
  onPress,
  right,
}: {
  title: string;
  company: string;
  location: string;
  allowance?: string;
  onPress: () => void;
  right?: ReactNode;
}) {
  return (
    <View style={styles.jobCard}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <CompanyAvatar name={company} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.jobTitle}>{title}</Text>
          <Text style={styles.company}>{company}</Text>
          <Text style={styles.meta}>{location}</Text>
          {allowance ? <Text style={styles.allowance}>{allowance}</Text> : null}
        </View>
      </TouchableOpacity>
      {right}
    </View>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.white },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36, gap: 16 },
  heading: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  headingTitle: { color: palette.ink, fontSize: 23, fontWeight: "800" },
  subtitle: { color: palette.muted, fontSize: 13, marginTop: 4, lineHeight: 19 },
  backButton: { width: 34, height: 34, justifyContent: "center" },
  backText: { color: palette.navy, fontSize: 34, lineHeight: 36 },
  primaryButton: {
    minHeight: 50, borderRadius: 10, backgroundColor: palette.navy,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 18,
  },
  primaryButtonText: { color: palette.white, fontSize: 15, fontWeight: "800" },
  secondaryButton: { backgroundColor: palette.pale, borderWidth: 1, borderColor: palette.border },
  secondaryButtonText: { color: palette.navy },
  field: { gap: 7 },
  label: { color: palette.ink, fontSize: 13, fontWeight: "700" },
  input: {
    minHeight: 46, borderWidth: 1, borderColor: palette.border, borderRadius: 9,
    paddingHorizontal: 13, paddingVertical: 11, color: palette.ink, fontSize: 14,
    backgroundColor: palette.white,
  },
  multiline: { minHeight: 104, textAlignVertical: "top" },
  avatar: { backgroundColor: palette.navy, alignItems: "center", justifyContent: "center" },
  jobCard: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 13,
    borderWidth: 1, borderColor: palette.border, borderRadius: 14, backgroundColor: palette.white,
  },
  jobTitle: { color: palette.ink, fontSize: 14, fontWeight: "800" },
  company: { color: palette.ink, fontSize: 12, fontWeight: "600" },
  meta: { color: palette.muted, fontSize: 11 },
  allowance: { color: palette.navy, fontSize: 11, fontWeight: "700" },
  empty: { alignItems: "center", paddingHorizontal: 22, paddingVertical: 34, gap: 9 },
  emptyTitle: { color: palette.ink, fontSize: 17, fontWeight: "800", textAlign: "center" },
  emptyDescription: { color: palette.muted, fontSize: 13, textAlign: "center", lineHeight: 19 },
});
