export type SignupFields = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};
export type SignupErrors = Partial<Record<keyof SignupFields, string>>;

export function validateSignup(fields: SignupFields): SignupErrors {
  const errors: SignupErrors = {};
  if (!fields.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Enter a valid email address.';
  if (fields.password.length < 6) errors.password = 'Use at least 6 characters.';
  if (!fields.confirmPassword) errors.confirmPassword = 'Confirm your password.';
  else if (fields.password !== fields.confirmPassword) errors.confirmPassword = 'Your passwords do not match.';
  if (!fields.termsAccepted) errors.termsAccepted = 'Please read and accept the terms to continue.';
  return errors;
}

export function signupErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'This email already has an account. Use a different email or sign in to your existing account.',
    'auth/invalid-email': 'Please check your email address.',
    'auth/weak-password': 'Choose a stronger password that meets the account password requirements.',
    'auth/password-does-not-meet-requirements': 'Choose a stronger password that meets the account password requirements.',
    'auth/network-request-failed': 'Unable to connect. Check your internet connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'signup/profile-incomplete': 'Your account was created, but your profile could not be saved. Keep this page open and retry profile setup.',
  };
  return messages[code] ?? 'We couldn’t create your account right now. Please try again later.';
}
