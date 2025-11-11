import { MMKV } from "react-native-mmkv";

type Serializable = string | number | boolean | Record<string, unknown> | Array<unknown>;

const storage = new MMKV({ id: "hiko-app" });

export function setItem(key: string, value: Serializable | null) {
  if (value === null || value === undefined) {
    storage.delete(key);
    return;
  }
  if (typeof value === "string") {
    storage.set(key, value);
  } else if (typeof value === "number" || typeof value === "boolean") {
    storage.set(key, value);
  } else {
    storage.set(key, JSON.stringify(value));
  }
}

export function getString(key: string): string | undefined {
  const value = storage.getString(key);
  return value === undefined || value === null ? undefined : value;
}

export function getObject<T>(key: string): T | undefined {
  const value = storage.getString(key);
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse MMKV value for ${key}`, error);
    storage.delete(key);
    return undefined;
  }
}

export function setObject<T extends Serializable>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  storage.delete(key);
}

export { storage as mmkvInstance };
