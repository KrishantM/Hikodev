import { logger } from "firebase-functions";

import { syncDocAssets } from "./doc/syncAssets";

export async function seedDemoContent() {
  logger.info("Running manual DOC seed (limited)");
  const summary = await syncDocAssets({ trackLimit: 50 });
  logger.info("DOC seed completed", summary);
  return summary;
}
