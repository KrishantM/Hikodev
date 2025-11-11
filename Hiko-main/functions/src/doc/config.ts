import { logger } from "firebase-functions";

export const DOC_API_KEY_ENV = "DOC_API_KEY";
export const DOC_BASE_ENV = "DOC_BASE";

export const DOC_DEFAULT_PAGE_SIZE = 100;
export const DOC_COORDINATES_SYSTEM = "wgs84";

export function getDocBaseUrl(): string {
  const base = process.env[DOC_BASE_ENV];
  if (!base) {
    logger.error("DOC_BASE secret is missing");
    throw new Error("DOC_BASE secret not set");
  }
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export function getDocApiKey(): string {
  const key = process.env[DOC_API_KEY_ENV];
  if (!key) {
    logger.error("DOC_API_KEY secret is missing");
    throw new Error("DOC_API_KEY secret not set");
  }
  return key;
}
