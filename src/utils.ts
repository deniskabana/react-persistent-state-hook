import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { error } from "./console"
import type { StorageTypeArg } from "./usePersistentState"

/**
 * Perform automatic checks when necessary
 */
export function checkStorageAvailability(storageType: StorageTypeArg, storageKey: string, verbose?: boolean): boolean {
  if (checkWindow(verbose)) return true
  if (checkBrowserStorage(verbose)) return true
  if (checkStorageType(storageType, verbose)) return true
  if (checkMissingStorageKey(storageKey, verbose)) return true
  return false
}

/**
 * Retrieve storage object from window.
 */
export function getStorage(storageType: StorageTypeArg): Storage | void {
  const storage = (window as any)[`${storageType}Storage`]
  if (!storage) error("BrowserStorage is not available.")
  return storage
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
