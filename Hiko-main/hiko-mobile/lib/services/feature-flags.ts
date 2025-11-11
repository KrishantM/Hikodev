import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FeatureFlags } from "@/lib/types";

const DEFAULT_FLAGS: FeatureFlags = {
  FEATURE_DOC: false,
  FEATURE_CHAT: false,
  FEATURE_GPS_EXPERIMENTAL: true,
  FEATURE_RENTALS_STUB: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (!db) {
    return DEFAULT_FLAGS;
  }
  try {
    const docRef = doc(db, "integrations", "featureFlags");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_FLAGS, ...docSnap.data() } as FeatureFlags;
    }

    return DEFAULT_FLAGS;
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return DEFAULT_FLAGS;
  }
}

export async function getFeatureFlag(
  flag: keyof FeatureFlags
): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[flag];
}
