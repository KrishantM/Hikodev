import { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { auth } from "@/lib/firebase/config";
import { getString, setItem, removeItem } from "@/lib/storage/mmkv";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth:token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
          const token = await nextUser.getIdToken();
          setItem(TOKEN_KEY, token);
        } else {
          removeItem(TOKEN_KEY);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Auth state error", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading, token: getString(TOKEN_KEY) };
}

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error("Firebase Auth not initialised");
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  setItem(TOKEN_KEY, token);
  return result;
}

export async function signUp(email: string, password: string, name: string) {
  if (!auth) throw new Error("Firebase Auth not initialised");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  const token = await result.user.getIdToken();
  setItem(TOKEN_KEY, token);
  return result;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase Auth not initialised");

  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google client ID missing");
  }

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ["openid", "profile", "email"],
    redirectUri,
    responseType: AuthSession.ResponseType.Token,
  });

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const result = await request.promptAsync(discovery, { useProxy: true });
  if (result.type !== "success" || !result.params.id_token) {
    throw new Error("Google sign-in failed");
  }

  const credential = GoogleAuthProvider.credential(result.params.id_token);
  const userCredential = await signInWithCredential(auth, credential);
  const token = await userCredential.user.getIdToken();
  setItem(TOKEN_KEY, token);
  return userCredential;
}

export async function signOut() {
  if (!auth) return;
  await firebaseSignOut(auth);
  removeItem(TOKEN_KEY);
}
