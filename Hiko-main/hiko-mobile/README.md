# Hiko - New Zealand Hiking Planner (Mobile)

A native mobile app for planning hiking trips in New Zealand, built with Expo and React Native.

## Features

- 🗺️ **Explore Trails**: Discover hiking tracks with interactive maps
- 🌤️ **Live Weather**: Real-time weather forecasts for trail safety
- 👥 **Social Planning**: Plan trips with friends and coordinate gear
- 📍 **GPS Tracking**: Track your hikes (beta)
- 🏕️ **DOC Integration**: Official track status and hut information
- 📱 **Native Mobile**: Built with Expo for iOS and Android

## Tech Stack

- **Framework**: Expo ~54.0.7
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: TanStack Query
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: React Native Maps
- **Location**: Expo Location

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
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
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
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home
│   │   ├── explore.tsx    # Explore trails
│   │   ├── trips.tsx     # User trips
│   │   └── profile.tsx   # User profile
│   ├── hikes/[id].tsx    # Hike details
│   ├── trips/[id].tsx    # Trip details
│   ├── plan.tsx          # Trip planner
│   └── auth/signin.tsx   # Authentication
├── lib/                  # Core libraries
│   ├── firebase/        # Firebase config
│   ├── services/        # Business logic
│   ├── auth/           # Authentication
│   ├── types/          # TypeScript types
│   └── schemas/        # Zod schemas
└── assets/             # Images, icons
```

## Development

### Running on Device

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan QR code with Expo Go (iOS) or Camera app (Android)

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Testing

The app will run with mock data if Firebase isn't configured. You can:
- View all screens and navigation
- Test UI components
- See the app structure

For full functionality, configure Firebase credentials.

## Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## License

Private - All rights reserved
