# Qoppy

Qoppy is a polished Expo + React Native snippet manager for saving text you reuse often, organizing it into categories, and copying it in one tap.

It is built for a clean mobile-first experience with local storage, optional app lock, favorites, Premium upgrade boilerplate, and a custom floating tab bar UI.

## Features

- Save, edit, delete, search, and favorite text snippets
- Organize snippets with custom categories
- One-tap copy with optional haptic feedback
- Free tier limited to 10 snippets
- Premium boilerplate with unlimited snippets
- Local app lock with 4-digit PIN, 6-character alphanumeric password, or biometrics
- 5-minute unlock grace period before app lock is required again
- Light and dark theme support
- Custom Android icon, adaptive icon, splash, and web favicon assets

## Tech Stack

- Expo 53
- React Native 0.79
- TypeScript
- React Navigation
- Expo SQLite
- Expo Secure Store
- Expo Local Authentication
- React Native Reanimated

## Project Structure

```text
src/
|-- components/
|   |-- cards/
|   `-- common/
|-- constants/
|-- hooks/
|   |-- useAuth.tsx
|   |-- useCategories.tsx
|   |-- useSnippets.tsx
|   `-- useTheme.tsx
|-- navigation/
|   |-- AuthGate.tsx
|   |-- MainTabNavigator.tsx
|   `-- RootNavigator.tsx
|-- screens/
|   |-- AddSnippetScreen.tsx
|   |-- FavoritesScreen.tsx
|   |-- HomeScreen.tsx
|   |-- LockScreen.tsx
|   |-- ManageCategoriesScreen.tsx
|   |-- OnboardingScreen.tsx
|   |-- PaywallScreen.tsx
|   |-- SettingsScreen.tsx
|   `-- SetupPINScreen.tsx
|-- services/
|   |-- authService.ts
|   |-- authValidation.ts
|   `-- database.ts
`-- types/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Android Studio for Android builds
- An Android device or emulator

### Install

```bash
npm install
```

### Run the App

```bash
npm run android
```

Other scripts:

```bash
npm run start
npm run web
```

## App Configuration

Current app identifiers:

- App name: `Qoppy`
- Expo slug: `qoppy`
- Android package: `com.qoppy.app`
- iOS bundle identifier: `com.qoppy.app`

Assets configured in `app.json`:

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash.png`
- `assets/favicon.png`

## Data and Security

- Snippets and preferences are stored locally with SQLite
- App-lock secrets are hashed with `bcryptjs` using 12 salt rounds
- Biometric unlock uses the device's enrolled biometric method
- Unlock state is stored locally with a 5-minute grace window after backgrounding
- Android backup is disabled in the production manifest
- Unused storage and overlay permissions were removed from the main Android manifest

## Premium Boilerplate

Qoppy currently includes local Premium boilerplate for product flow testing:

- Free users can save up to 10 snippets
- Premium users can save unlimited snippets
- The Premium screen includes placeholder purchase options for:
  - Stripe credit card
  - USDT
  - BTC

The current purchase flow is local/demo logic only and does not yet connect to a secure payment backend.

## Release Notes Before Publishing

Before generating a production APK or Play Store build, make sure to:

1. Create and configure a real Android release keystore
2. Replace the debug signing config in `android/app/build.gradle`
3. Test the app-lock flow on a clean install
4. Connect Premium purchases to your real payment backend
5. Review legal links and support contact details

## Development Notes

- The app is portrait-only
- The default theme is dark mode
- The main app experience is behind `AuthGate` when app lock is enabled
- The floating tab bar is custom-rendered in `MainTabNavigator.tsx`

## Roadmap Ideas

- Secure cloud sync
- Real Premium billing integration
- Export/import backups
- Snippet sharing
- Widgets and quick actions.
