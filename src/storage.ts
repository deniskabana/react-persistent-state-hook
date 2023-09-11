import { checkStorageAvailability, getStorage } from "./utils"
import { error } from "./console"
import type { StorageTypeArg } from "./usePersistentState"

/**
 * Retrieves a value from BrowserStorage or return value provided.
 */
export function storageGet(storageType: StorageTypeArg, storageKey: string, value: unknown): unknown | void {
  if (checkStorageAvailability(storageType, storageKey)) return value

  try {
    const storedValue = getStorage(storageType)?.getItem(storageKey)
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
export function storageSet(storageType: StorageTypeArg, storageKey: string, value?: string): void {
  if (checkStorageAvailability(storageType, storageKey)) return

  if (typeof value !== "undefined" && typeof value !== "string") {
    error("Invalid value type passed to usePersistentState/storageSet. Expected string or undefined.")
  }

  if (typeof value !== "string" || !value?.length) {
    storageRemove(storageType, storageKey)
    return
  }

  getStorage(storageType)?.setItem(storageKey, value)
}

/**
 * Removes a given key from BrowserStorage.
 */
export function storageRemove(storageType: StorageTypeArg, storageKey: string): void {
  if (checkStorageAvailability(storageType, storageKey)) return

  getStorage(storageType)?.removeItem(storageKey)
}
