import { checkBrowserStorage, checkMissingStorageKey, checkStorageType, checkWindow } from "./checkErrors"
import { error } from "./console"
import type { Options, StorageType } from "./types"

// Acronym for react-persistent-state-hook
export const KEY_PREFIX = "[rpsh]"

export const DEFAULT_OPTIONS: Options = {
  verbose: false,
  storageType: "local",
  persistent: true,
  prefix: KEY_PREFIX,
}

/**
 * Either prefix chosen storage key or generate one from state as string hash
 */
export function generateStorageKey(storageKey: string, initialState: unknown, options: Options): string {
  if (storageKey) return `${options.prefix}:${storageKey}`

  let key: string = storageKey
  if (!key) key = hashString(typeof initialState === "function" ? initialState() : initialState, options)
  key = key.replace(/[^A-Za-z0-9-_@/]/gi, "-")
  return key
}

/**
 * Perform automatic checks when necessary
 */
export function checkStorageAvailability(
  storageType: StorageType,
  storageKey: string | undefined,
  verbose: boolean,
): boolean {
  if (checkWindow(verbose)) return true
  if (checkBrowserStorage(verbose)) return true
  if (checkStorageType(storageType, verbose)) return true
  if (checkMissingStorageKey(storageKey, verbose)) return true
  return false
}

/**
 * Retrieve storage object from window.
 */
export function getStorage(storageType: StorageType | unknown, verbose: boolean): Storage {
  if (!checkWindow(verbose)) {
    switch (storageType) {
      case "local":
        return window.localStorage
      case "session":
        return window.sessionStorage
    }
  }
  return window.sessionStorage
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
 * - Generates a hash from state as string using djb2 algorithm
 */
export function hashString(value: unknown, options: Options): string {
  let serialized = value?.toString() ?? String(value)

  try {
    serialized = JSON.stringify(value) ?? ""
    serialized = `${options.prefix}_${serialized}`
    if (typeof serialized !== "string") throw new Error("Failed to serialize state.")

    let hash = 0
    for (let i = 0; i < serialized.length; i += 1) {
      hash = (hash << 5) - hash + serialized.charCodeAt(i)
      hash &= hash // Convert to 32bit integer
    }

    return new Uint32Array([hash])[0].toString(36)
  } catch (err) {
    if (options.verbose) error("Failed to generate storage key. See next console message for details.", err)
    return serialized
  }
}
