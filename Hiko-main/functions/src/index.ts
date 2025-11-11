import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

import { DOC_API_KEY_ENV, DOC_BASE_ENV } from "./doc/config";
import { syncDocAlerts as runSyncDocAlerts } from "./doc/syncAlerts";
import { syncDocAssets as runSyncDocAssets } from "./doc/syncAssets";
import { seedDemoContent } from "./seed";

export const syncDocAssets = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "UTC",
    secrets: [DOC_API_KEY_ENV, DOC_BASE_ENV],
  },
  async () => {
    await runSyncDocAssets();
  }
);

export const syncDocAlerts = onSchedule(
  {
    schedule: "0 * * * *",
    timeZone: "UTC",
    secrets: [DOC_API_KEY_ENV, DOC_BASE_ENV],
  },
  async () => {
    await runSyncDocAlerts();
  }
);

export const manualSyncDocAssets = onCall({
  secrets: [DOC_API_KEY_ENV, DOC_BASE_ENV],
}, async () => {
  return runSyncDocAssets();
});

export const seedDocDemo = onCall({
  secrets: [DOC_API_KEY_ENV, DOC_BASE_ENV],
}, async () => {
  return seedDemoContent();
});
