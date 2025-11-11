import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const app = getApps().length
  ? getApps()[0]!
  : initializeApp();

export const firestore = getFirestore(app);
export const storage = getStorage(app);
