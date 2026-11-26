# InternLink

InternLink is a React Native / Expo mobile application for connecting students with internship opportunities and helping employers publish opportunities and review applications.

## Technology

- Expo SDK 58
- React Native 0.88
- Expo Router
- TypeScript
- Firebase Authentication
- Cloud Firestore
- AsyncStorage for persistent Firebase Auth sessions

## Main screen flow

- Splash / brand intro
- Role selection
- Student onboarding
- Login and sign up
- Student tabs: Home, Explore, Applications, Messages, Profile
- Internship details and application form
- Saved internships, profile editing, settings, notifications
- Employer dashboard, internship posting, applicants, applicant details

See `IMPLEMENTATION_NOTES.md` for the current screen coverage, Firestore data model, and features that still need configuration.

## Local setup

1. Install dependencies with the Expo-compatible installer:

   ```cmd
   npx expo install
   ```

2. Copy `.env.example` to `.env` and fill in the six `EXPO_PUBLIC_FIREBASE_*` values from your Firebase web app configuration (Firebase console → Project settings → Your apps → Web app). Restart Expo with `npx expo start -c` after changing `.env`.
3. Set real HTTPS values for `EXPO_PUBLIC_TERMS_URL` and `EXPO_PUBLIC_PRIVACY_URL` before publishing. Signup works without them during development, but production builds block signup until both are set.
4. Publish `firestore.rules` to your Firebase project (Firestore Database → Rules → Publish, or `npx firebase-tools deploy --only firestore:rules --project <your-project-id>`). The app depends on these rules: Firebase's default rules block every request, and looser rules let users read or change each other's data.

## Validation

```cmd
npx tsc --noEmit
npx expo lint
```

Start the development server only when you are ready to test:

```cmd
npx expo start
```

Do not commit `.env` or private credentials.
