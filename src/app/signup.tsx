
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import type { TextInputProps } from 'react-native';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GraduationCap from '@/components/graduation-cap';
import type { SignupErrors, SignupFields } from '@/lib/signup-validation';
import { signupErrorMessage, validateSignup } from '@/lib/signup-validation';

const termsUrl = process.env.EXPO_PUBLIC_TERMS_URL;
const privacyUrl = process.env.EXPO_PUBLIC_PRIVACY_URL;

const validUrl = (url?: string): url is string =>
  !!url && /^https:\/\//.test(url);

const termsReady = validUrl(termsUrl) && validUrl(privacyUrl);

const firebaseReady = [
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
].every(value => !!value?.trim());

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
  inputRef?: React.RefObject<React.ElementRef<typeof TextInput> | null>;
};

function Field({
  label,
  error,
  password,
  inputRef,
  ...props
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputBox,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          {...props}
          ref={inputRef}
          accessibilityLabel={label}
          placeholderTextColor="#70829D"
          secureTextEntry={password && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />

        {password && (
          <Pressable
            onPress={() => setVisible(!visible)}
            accessibilityRole="button"
            accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
            hitSlop={8}
            style={styles.showButton}
          >
            <Text style={styles.showText}>
              {visible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>

      {!!error && (
        <Text accessibilityLiveRegion="polite" style={styles.fieldError}>
          {error}
        </Text>
      )}
    </View>
  );
}

export default function SignupScreen() {
  const [role, setRole] = useState<'student' | 'employer'>('student');

  const [fields, setFields] = useState<SignupFields>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<SignupErrors>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [retryProfile, setRetryProfile] = useState(false);
  const [success, setSuccess] = useState(false);

  const [roleMenu, setRoleMenu] = useState(false);

  const submitting = useRef(false);

  const nameRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const emailRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const confirmRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const locked = busy || retryProfile;

  function update<K extends keyof SignupFields>(
    key: K,
    value: SignupFields[K]
  ) {
    setFields(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    setMessage('');
  }

  async function openDocument(url?: string) {
    if (!validUrl(url)) return;

    try {
      await Linking.openURL(url);
    } catch {
      setMessage('This document could not be opened. Please try again.');
    }
  }

  async function submit() {
    if (submitting.current) return;

    const nextErrors = validateSignup(fields);

    if (!termsReady) {
      delete nextErrors.termsAccepted;
    }

    setErrors(nextErrors);
    setMessage('');

    if (Object.keys(nextErrors).length) {
      if (nextErrors.fullName) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.password) passwordRef.current?.focus();
      else if (nextErrors.confirmPassword) confirmRef.current?.focus();

      return;
    }

    if (!termsReady || !firebaseReady) {
      setMessage('Registration isn’t open yet. Please check back soon.');
      return;
    }

    submitting.current = true;
    setBusy(true);

    try {
      const { signUpUser } = await import('../../backend/signup.js');

      await signUpUser({
        fullName: fields.fullName,
        email: fields.email,
        password: fields.password,
        role,
        termsAccepted: fields.termsAccepted,
      });

      setFields(current => ({
        ...current,
        password: '',
        confirmPassword: '',
      }));

      setSuccess(true);
      setRetryProfile(false);
    } catch (error) {
      setMessage(signupErrorMessage(error));

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'signup/profile-incomplete'
      ) {
        setRetryProfile(true);
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formPanel}>
            <View style={styles.header}>
              <GraduationCap />

              <Text accessibilityRole="header" style={styles.formTitle}>
                {success ? 'You’re all set!' : 'Create your account'}
              </Text>

              <Text style={styles.formSubtitle}>
                {success
                  ? 'Your InternLink account and profile are ready.'
                  : 'Start discovering internships laid for you.'}
              </Text>
            </View>

            {success ? (
              <Link href="/home" style={styles.successLink}>
                Continue to home →
              </Link>
            ) : (
              <>
                <Field
                  label="Full Name"
                  placeholder="Your full name"
                  value={fields.fullName}
                  onChangeText={v => update('fullName', v)}
                  error={errors.fullName}
                  inputRef={nameRef}
                  autoComplete="name"
                  autoCapitalize="words"
                  editable={!locked}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />

                <Field
                  label="Email Address"
                  placeholder="you@email.com"
                  value={fields.email}
                  onChangeText={v => update('email', v)}
                  error={errors.email}
                  inputRef={emailRef}
                  autoComplete="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!locked}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />

                <Field
                  label="Password"
                  placeholder="Create a password"
                  password
                  value={fields.password}
                  onChangeText={v => update('password', v)}
                  error={errors.password}
                  inputRef={passwordRef}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!locked}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />

                <Field
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  password
                  value={fields.confirmPassword}
                  onChangeText={v => update('confirmPassword', v)}
                  error={errors.confirmPassword}
                  inputRef={confirmRef}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!locked}
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Account type: ${role === 'student' ? 'Student / Applicant' : 'Employer'}`}
                  accessibilityState={{
                    expanded: roleMenu,
                    disabled: locked,
                  }}
                  disabled={locked}
                  onPress={() => setRoleMenu(true)}
                  style={styles.roleSelect}
                >
                  <Text style={styles.roleText}>
                    {role === 'student' ? 'Student / Applicant' : 'Employer'}
                  </Text>
                  <Text style={styles.chevron}>⌄</Text>
                </Pressable>

                <View style={styles.agreement}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel="I agree to the Terms and Privacy Policy"
                    accessibilityState={{
                      checked: fields.termsAccepted,
                      disabled: !termsReady || locked,
                    }}
                    disabled={!termsReady || locked}
                    onPress={() =>
                      update('termsAccepted', !fields.termsAccepted)
                    }
                    hitSlop={10}
                    style={[
                      styles.checkbox,
                      fields.termsAccepted && styles.checkboxChecked,
                      !termsReady && styles.checkboxDisabled,
                    ]}
                  >
                    {fields.termsAccepted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </Pressable>

                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text
                      accessibilityRole={termsReady ? 'link' : undefined}
                      onPress={
                        termsReady ? () => openDocument(termsUrl) : undefined
                      }
                      style={styles.termsLink}
                    >
                      Terms
                    </Text>
                    {' '}and{' '}
                    <Text
                      accessibilityRole={termsReady ? 'link' : undefined}
                      onPress={
                        termsReady ? () => openDocument(privacyUrl) : undefined
                      }
                      style={styles.termsLink}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                {!termsReady && (
                  <Text style={styles.availability}>
                    Terms will be available before registration opens.
                  </Text>
                )}

                {!!errors.termsAccepted && (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={styles.fieldError}
                  >
                    {errors.termsAccepted}
                  </Text>
                )}

                {!!message && (
                  <Text
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                    style={styles.message}
                  >
                    {message}
                  </Text>
                )}

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: busy, busy }}
                  disabled={busy}
                  onPress={submit}
                  style={({ pressed }) => [
                    styles.submit,
                    pressed && styles.submitPressed,
                    busy && styles.submitBusy,
                  ]}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>
                      {retryProfile ? 'Retry Profile Setup' : 'Create Account'}
                    </Text>
                  )}
                </Pressable>

                <Link href="/" asChild>
                  <Pressable
                    accessibilityRole="button"
                    disabled={locked}
                    style={styles.signInLink}
                  >
                    <Text style={styles.signInText}>
                      Already have an account?{' '}
                      <Text style={styles.signInBold}>Sign In</Text>
                    </Text>
                  </Pressable>
                </Link>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={roleMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleMenu(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityLabel="Close account type menu"
            accessibilityRole="button"
            style={StyleSheet.absoluteFill}
            onPress={() => setRoleMenu(false)}
          />

          <View accessibilityViewIsModal style={styles.modalCard}>
            <Text accessibilityRole="header" style={styles.modalTitle}>
              Account type
            </Text>

            {(['student', 'employer'] as const).map(item => (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{
                  checked: role === item,
                  selected: role === item,
                }}
                onPress={() => {
                  setRole(item);
                  setRoleMenu(false);
                }}
                style={[
                  styles.roleOption,
                  role === item && styles.roleOptionSelected,
                ]}
              >
                <Text style={styles.roleText}>
                  {item === 'student' ? 'Student / Applicant' : 'Employer'}
                </Text>
                <Text style={styles.roleText}>
                  {role === item ? '✓' : ''}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setRoleMenu(false)}
              accessibilityRole="button"
              style={styles.close}
            >
              <Text style={styles.signInText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flex: 1, backgroundColor: '#FFFFFF' },

  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 56,
  },

  formPanel: { width: '100%', maxWidth: 430 },

  header: {
    alignItems: 'center',
    marginBottom: 34,
  },

  formTitle: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '700',
    color: '#192D4A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop: 12,
  },

  formSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#70829D',
    marginTop: 10,
    textAlign: 'center',
  },

  field: { gap: 7, marginBottom: 10 },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#74849E',
  },

  inputBox: {
    borderColor: '#D6E0EE',
    borderWidth: 1.2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    minHeight: 54,
  },

  inputFocused: { borderColor: '#0C2E63' },
  inputError: { borderColor: '#B64B4B' },

  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 14,
    color: '#192D4A',
    outlineWidth: 0,
  },

  showButton: {
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },

  showText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#70829D',
  },

  fieldError: {
    color: '#AC3636',
    fontSize: 11,
    lineHeight: 17,
  },

  roleSelect: {
    borderWidth: 1.2,
    borderColor: '#D6E0EE',
    borderRadius: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  roleText: { fontSize: 14, color: '#192D4A' },

  chevron: {
    fontSize: 20,
    color: '#70829D',
    marginTop: -5,
  },

  agreement: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 23,
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#8494AD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#0C2E63',
    borderColor: '#0C2E63',
  },

  checkboxDisabled: {
    backgroundColor: '#F4F6FA',
    borderColor: '#BAC5D5',
  },

  checkmark: { color: '#fff', fontSize: 11 },

  termsText: {
    flex: 1,
    color: '#70829D',
    fontSize: 13,
    lineHeight: 20,
  },

  termsLink: { color: '#70829D' },

  availability: {
    fontSize: 10,
    color: '#8190A5',
    marginTop: 6,
    marginLeft: 25,
  },

  message: {
    backgroundColor: '#F0F4FA',
    borderRadius: 8,
    padding: 12,
    color: '#244369',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },

  submit: {
    backgroundColor: '#0C2E63',
    borderRadius: 12,
    minHeight: 58,
    marginTop: 32,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitPressed: { backgroundColor: '#071F46' },
  submitBusy: { opacity: 0.7 },

  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  signInLink: {
    paddingVertical: 24,
    alignItems: 'center',
  },

  signInText: {
    color: '#0C2E63',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  signInBold: { fontWeight: '700' },

  successLink: {
    color: '#0C2E63',
    textAlign: 'center',
    fontWeight: '700',
    padding: 20,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(14, 32, 59, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#192D4A',
    marginBottom: 18,
  },

  roleOption: {
    padding: 16,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  roleOptionSelected: { backgroundColor: '#EDF2F9' },

  close: {
    paddingTop: 22,
    paddingBottom: 8,
  },
});
