import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Complete the auth session when done
WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.warn("Auth state change error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn("Auth setup error:", error);
      setLoading(false);
    }
  }, []);

  return { user, loading };
}

export async function signIn(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase Auth not initialized");
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  await AsyncStorage.setItem("auth-token", token);
  return result;
}

export async function signUp(email: string, password: string, name: string) {
  if (!auth) {
    throw new Error("Firebase Auth not initialized");
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await result.user.updateProfile({ displayName: name });
  const token = await result.user.getIdToken();
  await AsyncStorage.setItem("auth-token", token);
  return result;
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase Auth not initialized");
  }

  try {
    // Get the Google OAuth client ID
    // You need to create a Google OAuth client ID in Google Cloud Console
    // and add it to your .env file as EXPO_PUBLIC_GOOGLE_CLIENT_ID
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error(
        "Google OAuth client ID not configured. Add EXPO_PUBLIC_GOOGLE_CLIENT_ID to your .env file. " +
        "Get it from https://console.cloud.google.com/apis/credentials"
      );
    }

    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    // Configure the OAuth request with implicit flow (for mobile apps)
    // Note: You need a Web Client ID (not iOS/Android client ID) for this to work
    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      extraParams: {
        // Request ID token in the response
        response_mode: "query",
      },
    });

    // Google OAuth discovery document
    const discovery = {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    };

    // Start the OAuth flow
    const result = await request.promptAsync(discovery, {
      useProxy: true,
    });

    if (result.type !== "success") {
      if (result.type === "cancel") {
        throw new Error("Google sign-in was cancelled");
      }
      throw new Error("Google sign-in failed");
    }

    // For implicit flow, we need to get the ID token from the URL fragment or params
    // However, expo-auth-session with useProxy handles this differently
    // We'll use the access token to get user info, then create a custom token
    // Actually, for Firebase, we need the ID token directly
    
    // Try to get id_token from params (may be in URL fragment)
    let id_token = result.params.id_token;
    
    // If not found, we need to use a different approach
    // For Firebase Auth with Google, we can use the access token to verify
    // But Firebase requires an ID token. Let's check if we can get it from the access token
    if (!id_token && result.params.access_token) {
      // Fetch user info to verify, but we still need ID token for Firebase
      // This is a limitation - we need Google to return ID token in implicit flow
      throw new Error(
        "ID token not received. Make sure your Google OAuth client is configured " +
        "to return ID tokens. Use a Web Application client ID, not a mobile client ID."
      );
    }

    if (!id_token) {
      throw new Error("No ID token received from Google");
    }

    // Create a Firebase credential from the Google ID token
    const credential = GoogleAuthProvider.credential(id_token);

    // Sign in to Firebase with the Google credential
    const userCredential = await signInWithCredential(auth, credential);
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem("auth-token", token);

    return userCredential;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    throw new Error(error.message || "Google sign-in failed");
  }
}

export async function signOut() {
  if (!auth) {
    return;
  }
  await firebaseSignOut(auth);
  await AsyncStorage.removeItem("auth-token");
}
