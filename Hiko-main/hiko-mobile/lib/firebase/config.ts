import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

import { mmkvInstance } from "@/lib/storage/mmkv";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const mmkvPersistence = getReactNativePersistence({
  setItem: (key: string, value: string) => {
    mmkvInstance.set(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) => Promise.resolve(mmkvInstance.getString(key) ?? null),
  removeItem: (key: string) => {
    mmkvInstance.delete(key);
    return Promise.resolve();
  },
});

function bootstrap() {
  if (app) return;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }

  try {
    auth = initializeAuth(app, { persistence: mmkvPersistence });
  } catch (error: any) {
    if (error?.code === "auth/already-initialized") {
      auth = getAuth(app);
    } else {
      console.warn("Firebase Auth initialization failed", error);
      auth = null;
    }
  }

  try {
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firestore initialization failed", error);
    db = null;
  }

  try {
    storage = getStorage(app);
  } catch (error) {
    console.warn("Storage initialization failed", error);
    storage = null;
  }
}

bootstrap();

export { app, auth, db, storage };
