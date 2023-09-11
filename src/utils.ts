import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { error } from "./console"
import type { StorageType } from "./usePersistentState"

/**
 * Perform automatic checks when necessary
 */
export function checkStorageAvailability(storageType: StorageType, storageKey: string, verbose?: boolean): boolean {
  if (checkWindow(verbose)) return true
  if (checkBrowserStorage(verbose)) return true
  if (checkStorageType(storageType, verbose)) return true
  if (checkMissingStorageKey(storageKey, verbose)) return true
  return false
}

/**
 * Retrieve storage object from window.
 */
export function getStorage(storageType: StorageType | unknown, verbose?: boolean): Storage | void {
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
export function serializeValue(value: unknown): string {
  try {
    let result = JSON.stringify(value)
    result = result === "undefined" ? "" : result
    return result
  } catch (err) {
    error("Failed to serialize value. See next console message for details.", err)
    return ""
  }
}
