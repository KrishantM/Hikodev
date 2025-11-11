# Hiko Mobile App MVP

A React Native mobile app for discovering and tracking New Zealand hiking trails, built with Expo.

## Features

- **Trail Discovery**: Browse featured New Zealand hiking trails
- **Search Functionality**: Search trails by name, description, or region
- **Trail Details**: View comprehensive trail information including difficulty, distance, duration, and elevation
- **User Profile**: Track completed trails and personal statistics
- **Modern UI**: Clean, intuitive interface optimized for mobile

## Mock Data

The app includes mock data for 5 popular New Zealand trails:
- Tongariro Alpine Crossing
- Milford Track
- Hooker Valley Track
- Roys Peak Track
- Abel Tasman Coast Track

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Navigate to the project directory:
   ```bash
   cd hiko-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server:
   ```bash
   npx expo start
   ```

2. **Testing on Mobile Device (Recommended):**
   - Install "Expo Go" app from App Store (iOS) or Google Play Store (Android)
   - Scan the QR code displayed in your terminal/browser
   - The app will load on your device with live reloading

3. **Testing on Web (Alternative):**
   ```bash
   npx expo start --web
   ```
   - Opens in your browser at `http://localhost:19006`

4. **Testing on iOS Simulator (macOS only):**
   ```bash
   npx expo start --ios
   ```

5. **Testing on Android Emulator:**
   ```bash
   npx expo start --android
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── TrailCard.tsx   # Trail display component
├── screens/            # Screen components
│   ├── HomeScreen.tsx  # Main trail discovery screen
│   ├── TrailDetailScreen.tsx  # Individual trail details
│   └── ProfileScreen.tsx      # User profile and settings
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── data/              # Mock data
│   └── mockData.ts
└── types/             # TypeScript type definitions
    └── index.ts
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Expo Vector Icons**: Icon library

## Development Notes

- The app uses mock data for demonstration purposes
- Navigation is set up with bottom tabs and stack navigation
- All components are built with TypeScript for type safety
- The UI follows iOS design guidelines with custom styling

## Next Steps for Production

1. **Backend Integration**: Connect to real API endpoints
2. **Authentication**: Implement user login/signup
3. **Location Services**: Add GPS tracking for hikes
4. **Offline Support**: Cache trail data for offline use
5. **Push Notifications**: Weather alerts and trail updates
6. **Photo Integration**: Allow users to add photos to hikes
7. **Social Features**: Share hikes and connect with friends

## Troubleshooting

- If you encounter issues with dependencies, try clearing the cache:
  ```bash
  npx expo start --clear
  ```
- For iOS simulator issues, ensure Xcode is installed
- For Android emulator issues, ensure Android Studio is set up
- Check the Expo documentation for platform-specific setup guides
