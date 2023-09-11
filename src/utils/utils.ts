import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { error } from "./console"
import type { Options, StorageType } from "../usePersistentState"

// Acronym for react-persistent-state-hook
export const KEY_PREFIX = "[rpsh]"

/**
 * Either prefix chosen storage key or generate one from state as string hash
 */
export function generateStorageKey(options: Options, initialState: unknown) {
  let key = options.storageKey
  if (!key) key = hashString(typeof initialState === "function" ? initialState() : initialState, options.verbose)
  return `${KEY_PREFIX}:${key}`
}

/**
 * Perform automatic checks when necessary
 */
export function checkStorageAvailability(storageType: StorageType, storageKey: string, verbose: boolean): boolean {
  if (checkWindow(verbose)) return true
  if (checkBrowserStorage(verbose)) return true
  if (checkStorageType(storageType, verbose)) return true
  if (checkMissingStorageKey(storageKey, verbose)) return true
  return false
}

/**
 * Retrieve storage object from window.
 */
export function getStorage(storageType: StorageType | unknown, verbose: boolean): Storage | void {
  if (!checkWindow(verbose)) {
    switch (storageType) {
      case "local":
        return window.localStorage
      case "session":
        return window.sessionStorage
    }
  }

  if (verbose) error("BrowserStorage is not available.")
}

/**
 * A function that serializes a value to a string or provides safe empty string.
 */
export function serializeValue(value: unknown, verbose: boolean): string {
  try {
    let result = JSON.stringify(value === undefined ? "" : value)
    result = result === "undefined" ? "" : result
    return result
  } catch (err) {
    if (verbose) error("Failed to serialize value. See next console message for details.", err)
    return ""
  }
}

/**
 * A function used when storage key is not provided
 */
export function hashString(value: unknown, verbose: boolean): string {
  try {
    const serialized = JSON.stringify(value) ?? ""
    if (typeof serialized !== "string") throw new Error("Failed to serialize state.")

    let hash = 0
    for (let i = 0; i < serialized.length; i += 2) {
      const chr = serialized.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash.toString(32).substring(2)
  } catch (err) {
    if (verbose) error("Failed to generate storage key. See next console message for details.", err)
    return Math.random().toString(32).substring(2) // Pseudo random for this session at least
  }
}
