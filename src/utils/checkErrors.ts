import { error, warn } from "./console"
import { StorageType } from "./types"

/**
 * Returns true if storage key is missing, false if it's a valid string of length >= 1.
 */
export function checkMissingStorageKey(storageKey: unknown, verbose: boolean): boolean {
  if (typeof storageKey !== "string" || !storageKey?.length) {
    if (verbose) warn("No storage key provided. Resorted to `React.useState`.")
    return true
  } else {
    return false
  }
}

/**
 * Returns true if storage type is invalid, false if it's a member of `StorageType` enum.
 */
export function checkStorageType(storageType: StorageType, verbose: boolean): boolean {
  if (storageType !== "local" && storageType !== "session") {
    if (verbose) warn("Invalid storage type provided. Resorted to `React.useState`.")
    return true
  } else {
    return false
  }
}

/**
 * Returns true if running in a non-browser environment, false if running in a browser environment.
 */
export function checkWindow(verbose: boolean): boolean {
  if (typeof window === "undefined") {
    if (verbose) warn("You are running in a non-browser environment. Resorted to `React.useState`.")
    return true
  } else {
    return false
  }
}

/**
 * Returns true if running in an environment that does not support BrowserStorage API, false if it does.
 */
export function checkBrowserStorage(verbose: boolean): boolean {
  if (checkWindow(verbose)) return true

  if (!("localStorage" in window) && !("sessionStroage" in window)) {
    if (verbose) warn("You are running in an environment that does not support BrowserStorage API.")
    return true
  } else {
    return false
  }
}

/**
 * Returns true if value is serializable, false if it's not.
 * **Provide a stringified value.**
 */
export function checkIfSerializable(value: string, verbose: boolean): boolean {
  try {
    const isSerializable = value === JSON.stringify(JSON.parse(value))
    if (!isSerializable && verbose) warn("Provided state value is not serializable.", value)
    return isSerializable
  } catch (err) {
    if (verbose)
      error("An error occured while using JSON.stringify and JSON.parse to check if value is serializable.", value)
    return false
  }
}
