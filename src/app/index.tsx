
import { useRouter } from 'expo-router';
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import GraduationCap from '@/components/graduation-cap';
import { auth, db } from '../../backend/firebaseConfig.js';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const firebaseReady = Boolean(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  );

  async function handleLogin() {
    if (loading) return;

    setMessage('');

    if (!email.trim() || !password) {
      setMessage('Please enter your email and password.');
      return;
    }

    if (!firebaseReady) {
      setMessage('Login is currently unavailable. Please check your Firebase settings.');
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const userDocument = await getDoc(
        doc(db, 'users', result.user.uid)
      );

      if (!userDocument.exists()) {
        setMessage('Your account profile is incomplete. Please contact support.');
        return;
      }

      router.replace('/home' as any);
    } catch (error: any) {
      console.log('Login error:', error);

      if (error.code === 'auth/invalid-credential') {
        setMessage('Incorrect email or password.');
      } else if (error.code === 'auth/user-not-found') {
        setMessage('No account was found with this email.');
      } else if (error.code === 'auth/too-many-requests') {
        setMessage('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        setMessage('Network error. Please check your internet connection.');
      } else {
        setMessage('Unable to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setMessage('');

    if (!email.trim()) {
      setMessage('Enter your email address first to reset your password.');
      return;
    }

    if (!firebaseReady) {
      setMessage('Password reset is currently unavailable.');
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase()
      );

      setMessage('Password reset instructions have been sent to your email.');
    } catch (error: any) {
      console.log('Password reset error:', error);
      setMessage('Unable to send the reset email. Please check your email address.');
    }
  }

  function handleGoogleLogin() {
    setMessage('Google sign-in has not been configured yet.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <GraduationCap />
            <Text style={styles.logoText}>InternLink</Text>
          </View>

          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to continue your internship journey
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />

              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showPassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.optionText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {!!message && (
              <Text style={styles.message}>{message}</Text>
            )}

            <Pressable
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </Pressable>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>
            Internship-focused • Student-friendly
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 45,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#172B4D',
    marginTop: 8,
  },
  headingContainer: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#172B4D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#172B4D',
  },
  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#172B4D',
  },
  showPassword: {
    color: '#172B4D',
    fontSize: 13,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#172B4D',
    borderColor: '#172B4D',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  optionText: {
    color: '#4B5563',
    fontSize: 12,
  },
  forgotText: {
    color: '#172B4D',
    fontSize: 12,
    fontWeight: '600',
  },
  message: {
    color: '#B42318',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#172B4D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginHorizontal: 14,
  },
  googleButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 13,
  },
  signupLink: {
    color: '#172B4D',
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 45,
  },
});
