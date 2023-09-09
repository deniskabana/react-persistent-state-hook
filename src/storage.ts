import { error } from "./console"
import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { StorageTypeArg } from "./usePersistentState"

/**
 * Perform automatic checks when necessary
 */
function checkStorageAvailability(storageType: StorageTypeArg, storageKey: string): boolean {
  if (checkWindow()) return true
  if (checkBrowserStorage()) return true
  if (checkStorageType(storageType)) return true
  if (checkMissingStorageKey(storageKey)) return true
  return false
}

/**
 * Retrieve storage object from window UNSAFELY.
 * **ONLY USE WITHIN TRY-CATCH**
 */
function getStorage(storageType: StorageTypeArg): Storage {
  // `window as any` -> since we're in a try-catch block
  const storage = (window as any)[`${storageType}Storage`]
  if (!storage)
    throw new Error(
      `react-persistent-hook-state: ${storageType}Storage is not available.\nIs your "storageType" correct? Accepted values are "local" and "session". You provided a value of "${storageType}".\nSee https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage and https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage for more information.}"`,
    )

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

/**
 * Retrieves a value from BrowserStorage or return value provided.
 */
export function storageGet(storageType: StorageTypeArg, storageKey: string, value: unknown): unknown | void {
  if (checkStorageAvailability(storageType, storageKey)) return value

  try {
    const storedValue = getStorage(storageType).getItem(storageKey)
    return storedValue?.length ? JSON.parse(storedValue) : value
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

  if (typeof value !== "string" || !value?.length) {
    storageRemove(storageType, storageKey)
    return
  }

  try {
    // `window as any` -> since we're in a try-catch block
    getStorage(storageType).setItem(storageKey, JSON.stringify(value))
  } catch (err) {
    error("Failed to save state to BrowserStorage. See next console message for details.", err)
  }
}

/**
 * Removes a given key from BrowserStorage.
 */
export function storageRemove(storageType: StorageTypeArg, storageKey: string): void {
  if (checkStorageAvailability(storageType, storageKey)) return

  try {
    // `window as any` -> since we're in a try-catch block
    getStorage(storageType).removeItem(storageKey)
  } catch (err) {
    error("Failed to remove state from BrowserStorage. See next console message for details.", err)
  }
}
