import { error } from "./console"
import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { StorageType } from "./usePersistentState"

// Utility function
function checkStorageAvailability(storageType: StorageType, storageKey: string): boolean {
  if (checkWindow()) return true
  if (checkBrowserStorage()) return true
  if (checkStorageType(storageType)) return true
  if (checkMissingStorageKey(storageKey)) return true
  return false
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

/**
 * Retrieves a value from BrowserStorage or return value provided.
 */
export function storageGet(storageType: StorageType, storageKey: string, value: unknown): unknown | void {
  if (checkStorageAvailability(storageType, storageKey)) return value

  try {
    const storedValue = window[`${storageType}Storage`].getItem(storageKey)
    return storedValue?.length ? JSON.parse(storedValue) : value
  } catch (err) {
    error("Failed to load and parse state from BrowserStorage. See next console message for details.", err)
    return value
  }
}

/**
 * Saves a given **serialized value** to BrowserStorage.
 */
export function storageSet(storageType: StorageType, storageKey: string, value?: string): void {
  if (checkStorageAvailability(storageType, storageKey)) return

  if (typeof value !== "string" || !value?.length) {
    storageRemove(storageType, storageKey)
    return
  }

  try {
    window[`${storageType}Storage`].setItem(storageKey, JSON.stringify(value))
  } catch (err) {
    error("Failed to save state to BrowserStorage. See next console message for details.", err)
  }
}

/**
 * Removes a given key from BrowserStorage.
 */
export function storageRemove(storageType: StorageType, storageKey: string): void {
  if (checkStorageAvailability(storageType, storageKey)) return

  try {
    window[`${storageType}Storage`].removeItem(storageKey)
  } catch (err) {
    error("Failed to remove state from BrowserStorage. See next console message for details.", err)
  }
}
