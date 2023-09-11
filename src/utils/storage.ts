import { checkStorageAvailability, getStorage } from "./utils"
import { error } from "./console"
import type { StorageType } from "../usePersistentState"

/**
 * Retrieves a value from BrowserStorage or return value provided.
 */
export function storageGet(
  storageType: StorageType,
  storageKey: string,
  value: unknown,
  verbose = false,
): unknown | void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return value

  try {
    const storedValue = getStorage(storageType, verbose)?.getItem(storageKey)
    const parsedValue = storedValue?.length ? JSON.parse(storedValue) : value
    return parsedValue
  } catch (err) {
    error("Failed to load and parse state from BrowserStorage. See next console message for details.", err)
    return value
  }
}

/**
 * Saves a given **serialized value** to BrowserStorage.
 */
export function storageSet(storageType: StorageType, storageKey: string, value?: string, verbose = false): void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return

  if (typeof value !== "undefined" && typeof value !== "string") {
    error("Invalid value type passed to usePersistentState/storageSet. Expected string or undefined.")
  }

  if (typeof value !== "string" || !value?.length) {
    storageRemove(storageType, storageKey)
    return
  }

  getStorage(storageType, verbose)?.setItem(storageKey, value)
}

/**
 * Removes a given key from BrowserStorage.
 */
export function storageRemove(storageType: StorageType, storageKey: string, verbose = false): void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return

  getStorage(storageType, verbose)?.removeItem(storageKey)
}
