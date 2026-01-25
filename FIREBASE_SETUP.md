# Firebase Setup Guide

This guide will help you set up Firebase for the UEFA C Quiz App analytics system.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "uefa-c-quiz-app")
4. Follow the setup wizard:
   - Disable Google Analytics if not needed (or enable if you want additional analytics)
   - Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`)
2. Register your app:
   - App nickname: `UEFA C Quiz App`
   - **Do not** check "Also set up Firebase Hosting" (unless you want to host on Firebase)
   - Click "Register app"

3. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 3: Enable Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** for security
4. Select a Cloud Firestore location (choose one close to your users)
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to write analytics events
    match /analytics-events/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish"

These rules allow:
- **Anyone** to create (write) analytics events
- **Only authenticated admins** to read, update, or delete events

## Step 5: Enable Firebase Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Click the **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 6: Create an Admin User

1. Still in **Authentication**, click the **Users** tab
2. Click "Add user"
3. Enter:
   - Email: Your admin email (e.g., `admin@yourdomain.com`)
   - Password: A strong password
4. Click "Add user"

**IMPORTANT**: Save these credentials - you'll use them to log into the analytics dashboard!

## Step 7: Configure Your App

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase config values from Step 2:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. Save the file

## Step 8: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app and interact with it (click materials, start a quiz, etc.)

3. Go to Firebase Console → Firestore Database
4. You should see an `analytics-events` collection with event documents

5. Test admin access:
   - Navigate to `http://localhost:5173/admin/login`
   - Log in with the admin credentials you created in Step 6
   - You should see the analytics dashboard with all the tracked events

## Security Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- Keep your admin credentials secure
- The Firestore rules allow anyone to write analytics (intentionally, so users can track events)
- Only authenticated admins can read the analytics data
- Consider adding IP restrictions or rate limiting in production

## Accessing the Analytics Dashboard

- **Login URL**: `https://yourdomain.com/admin/login`
- **Analytics URL**: `https://yourdomain.com/admin/analytics` (requires login)

## Exporting Data

Once logged in to the analytics dashboard, you can:
1. View real-time statistics
2. Click "Izvezi podatke" (Export data) to download a JSON file with all analytics
3. Use this data for your blog post analysis

## Troubleshooting

**Issue**: "Missing or insufficient permissions" error
- **Solution**: Check your Firestore security rules (Step 4)

**Issue**: Can't log in to admin panel
- **Solution**: Verify the admin user exists in Firebase Authentication (Step 6)

**Issue**: No analytics data appearing
- **Solution**: Check the browser console for errors, ensure `.env` file is configured correctly

**Issue**: "FirebaseError: Firebase: Error (auth/configuration-not-found)"
- **Solution**: Double-check all VITE_FIREBASE_* variables in your `.env` file
