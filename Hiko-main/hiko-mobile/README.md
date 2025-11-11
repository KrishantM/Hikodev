# Hiko - New Zealand Hiking Planner (Mobile)

A native mobile app for planning hiking trips in New Zealand, built with Expo and React Native.

## Features

- 🗺️ **Explore Tracks**: Browse DoC tracks on interactive MapLibre maps with rich filters.
- 🌤️ **Weather at a Glance**: Three-day forecast with MMKV-backed caching and provider attribution.
- 🚨 **Official Alerts**: View Department of Conservation alerts alongside live status summaries.
- 🧭 **Trip Planning**: Create multi-day trips, invite friends, and coordinate shared gear checklists.
- 🔒 **Offline Ready**: Persists trips, routes, and cached forecasts locally for offline reference.

## Tech Stack

- **Framework**: Expo ~54.0.7 (managed)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Data**: TanStack Query + custom MMKV persistence
- **State**: Zustand for lightweight UI state
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Maps**: `react-native-maplibre-gl`
- **Location**: `expo-location`

## Quick Start

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase project (optional for initial testing)

### Installation

1. **Install dependencies:**

```bash
cd hiko-mobile
npm install
```

2. **Set up environment variables:**

Create `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_MAP_TOKEN=your-maplibre-token
EXPO_PUBLIC_FEATURE_DOC=true
```

3. **Start the development server:**

```bash
npm start
```

Or for specific platforms:

```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
hiko-mobile/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Global providers (TanStack Query, SafeArea)
│   ├── (tabs)/               # Tab navigation (Home, Explore, Trips, Profile)
│   ├── hikes/[id].tsx        # Hike details with map + weather + alerts
│   ├── trips/[id].tsx        # Trip overview with offline cache badge
│   ├── plan.tsx              # Trip planner flow
│   └── auth/                 # Authentication modals
├── components/               # Reusable UI primitives
├── lib/
│   ├── auth/                 # Firebase auth helpers
│   ├── hooks/                # React Query hooks
│   ├── map/                  # MapLibre abstractions
│   ├── schemas/              # Shared Zod schemas
│   ├── services/             # Firestore/Weather service modules
│   ├── storage/              # MMKV adapters & persisters
│   └── store/                # Zustand stores
├── tests/                    # Vitest suites
└── assets/                   # Images, fonts
```

## Development

### Running on Device

1. Install the Expo Go app on your device.
2. Run `npm start` to launch Metro.
3. Scan the QR code with Expo Go (iOS) or the Camera app (Android).

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure the project
eas build:configure

# Build binaries
eas build --platform ios
eas build --platform android
```

## Testing & Quality

- `npm run lint` – ESLint with Expo + Prettier config
- `npm run test` – Vitest (includes weather + normaliser suites)
- Git hooks run the same commands on `pre-commit`

## Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## License

Private - All rights reserved
