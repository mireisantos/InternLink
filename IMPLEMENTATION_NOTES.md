# InternLink implementation notes

## Implemented in this source snapshot

### Main entry and authentication
- Root route waits for Firebase to restore a saved login: signed-in students go to Home, employers go to `/employer-dashboard`, and everyone else sees role selection.
- Login has a working "Remember me" option (ticked by default). If it is unticked, the user is signed out the next time the app opens.
- Logging in, signing up, and signing out clear the navigation history, so the Android back button cannot return to screens from the previous session.
- Role selection routes students to the student onboarding screen and employers to employer signup.
- Login remains at `/login`; signup remains at `/signup`.
- Login routes students to the student tabs and employer accounts to `/employer-dashboard`.
- Firebase Auth is configured with React Native AsyncStorage persistence.
- The Figma-style animated brand splash now displays InternLink instead of the Expo logo.

### Student experience
- Home and Explore use a shared internship card style and open internship details.
- Explore has search and category filters and a saved-internship action.
- Internship details display role description, requirements, and benefits.
- Apply form collects personal information and uses the existing `applyForInternship` backend helper. It conditionally asks for a resume URL when the posting requires one.
- Applications list reads the signed-in student's Firestore applications.
- Application details show the submitted application information.
- Saved internships reads the signed-in user's `savedInternships` array.
- Profile reads the signed-in user's Firestore profile.
- Edit Profile writes name, school, course, and phone number to the user's profile.
- Settings includes password reset and sign out.
- Notifications has an empty state ready for a notification data source.

### Messaging
- Messages list and conversation screen follow the Figma visual direction.
- The conversation screen currently uses local preview messages. It does NOT send or persist messages to Firestore yet.
- Sample conversations appear only in development (`__DEV__`). Production builds show a "No messages yet" empty state.
- Sample internships likewise appear only in development, when there are no live listings.

### Employer experience
- Employer dashboard lists postings owned by the signed-in employer and counts received applications.
- Post Internship uses the existing `postInternship` helper.
- Applicants lists applications for the signed-in employer.
- Applicant Details allows an employer to update application status.

## Firestore collections used

### `users/{uid}`
Expected fields include:
- `uid`
- `fullName`
- `email`
- `role` (`student` or `employer`)
- `profileStrength`
- `savedInternships` (array of internship document IDs)
- `school` (optional)
- `course` (optional)
- `phoneNumber` (optional)
- `createdAt`, `updatedAt`

### `internships/{internshipId}`
Written by `backend/internship-posting.js`:
- `employerId`, `createdBy`
- `title`, `company`, `location`
- `duration`, `allowance`, `description`, `category`
- `requirements` (array of strings)
- `benefits` (array of strings)
- `requiresResume`, `isActive`, `createdAt`

### `applications/{applicationId}`
Written by `backend/internship-app.js`:
- `studentId`, `employerId`, `jobId`
- `jobTitle`, `company`, `location`
- `fullLegalName`, `contactEmail`, `phoneNumber`, `school`, `course`
- `resumeUrl`
- `status` (starts as `pending`)
- `appliedAt`

## Important setup still required

1. The root `.env` is ignored by Git and must never be committed. Copy `.env.example` to `.env` and fill in the Firebase values locally.
2. Signup works during development without Terms/Privacy links, but production builds block signup until real HTTPS values are configured for `EXPO_PUBLIC_TERMS_URL` and `EXPO_PUBLIC_PRIVACY_URL`.
3. Resume handling currently accepts a shareable resume URL. Native file selection and Firebase Storage upload are not implemented; this needs `expo-document-picker` and Storage setup.
4. Messaging is currently a UI preview only. It needs a Firestore conversations/messages data model and security rules.
5. The `firestore.rules` file must be published to the Firebase project. The app's features and security depend on it: Firebase's default rules block every request, and looser rules let users read or change each other's data.
6. Employer self-registration currently permits a user to select the employer role. A production system should add an employer verification/approval process before allowing public job postings.
7. Google sign-in remains an unconfigured placeholder.
8. Notification records and push notifications are not implemented.

## Recommended validation sequence (do not start Expo without the user's approval)

From Windows CMD in the project folder:
```cmd
npx tsc --noEmit
npx expo lint
```

Only after the user explicitly approves app testing:
```cmd
npx expo start
```

Do not run `npm audit fix --force` as a blanket fix. Review audit details first.
