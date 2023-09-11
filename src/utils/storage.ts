import { checkStorageAvailability, getStorage } from "./utils"
import { error, info } from "./console"
import type { StorageType } from "../usePersistentState"

/**
 * Retrieves a value from BrowserStorage or return value provided.
 */
export function storageGet(
  storageType: StorageType,
  storageKey: string | undefined,
  value: unknown,
  verbose: boolean,
): unknown | void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return value
  if (verbose) info("Getting value by key from storage", { storageType, storageKey })

  try {
    const storedValue = getStorage(storageType, verbose)?.getItem(storageKey!)
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
export function storageSet(
  storageType: StorageType,
  storageKey: string | undefined,
  value: string | undefined,
  verbose: boolean,
): void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return
  if (verbose) info("Setting new value to a key in storage", { storageType, storageKey, value })
  if (typeof value !== "undefined" && typeof value !== "string")
    error("Invalid value type passed to usePersistentState/storageSet. Expected string or undefined.")

  if (typeof value === "string" && value?.length) {
    getStorage(storageType, verbose)?.setItem(storageKey!, value)
  } else {
    storageRemove(storageType, storageKey, verbose)
  }
}

/**
 * Removes a given key from.
 */
export function storageRemove(storageType: StorageType, storageKey: string | undefined, verbose: boolean): void {
  if (checkStorageAvailability(storageType, storageKey, verbose)) return
  if (verbose) info("Removing key from storage.", { storageType, storageKey })
  getStorage(storageType, verbose)?.removeItem(storageKey!)
}
