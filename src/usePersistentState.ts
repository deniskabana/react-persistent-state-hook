import { useState, useEffect, useRef } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  checkBrowserStorage,
  checkIfSerializable,
  checkMissingStorageKey,
  checkStorageType,
  checkWindow,
} from "./checkErrors"
import { storageSet, storageGet, storageRemove } from "./storage"
import { serializeValue } from "./utils"

// TYPES AND OPTIONS
// --------------------------------------------------

export type StorageType = "local" | "session"

/** Optional Options API for usePersistentState */
export type Options = Partial<{
  /** Print to console all warnings and errors. **Default**: `false` */
  verbose: boolean
  /** Silently swallow all (even user) errors. **Default**: `false` */
  silent: boolean
}>

const defaultOptions: Required<Options> = {
  verbose: false,
  silent: false,
} as const

// OVERLOADS
// --------------------------------------------------

/**
 * > #### usePersistentState
 *
 * > A drop-in replacement for React's `useState` hook that persists value in
 * > BrowserStorage API. To enable persistence, provide a unique `storageKey`.
 *
 * @param initialState - Initial state value
 * @param storageKey - Unique key for BrowserStorage API
 * @param storageType - BrowserStorage API type
 * @default "session"
 * @param options - Configuration options
 *
 * @description `React.useState` + BrowserStorage API for persistence
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey?: string,
  storageType?: StorageType,
  options?: Options,
): [S, Dispatch<SetStateAction<S>>]

/**
 * > #### usePersistentState
 *
 * > A drop-in replacement for React's `useState` hook that persists value in
 * > BrowserStorage API. To enable persistence, provide a unique `storageKey`.
 *
 * @param initialState - Initial state value
 * @param storageKey - Unique key for BrowserStorage API; `undefined` or empty string will disable persistence
 * @param storageType - BrowserStorage API type
 * @default "session"
 * @param options - Configuration options
 *
 * @description `React.useState` + BrowserStorage API for persistence
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey?: string,
  storageType?: StorageType,
  options?: Options,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// USE PERSISTENT STATE HOOK
// --------------------------------------------------

export function usePersistentState(
  initialState: unknown,
  storageKey: string = "",
  storageType: StorageType = "session",
  options: Options = defaultOptions,
) {
  options = { ...defaultOptions, ...options }
  options.silent = options.verbose || options.silent // Disable silent mode if verbose is enabled

  // Use React.useState internally
  const [value, setValue] = useState(() => {
    initialState = typeof initialState === "function" ? (initialState as () => unknown)() : initialState
    return storageGet(storageType, storageKey, initialState, options.verbose) ?? initialState
  })

  const isMounted = useRef(false) // Remember if we are past first render
  const shouldFallback = useRef(false) // Remember whether graceful fallback is necessary

  // Initial one-time checks - all verbose
  useEffect(() => {
    checkMissingStorageKey(storageKey, !options.silent) ||
      checkStorageType(storageType, !options.silent) ||
      checkWindow(!options.silent) ||
      checkBrowserStorage(!options.silent)

    shouldFallback.current = true
  }, [])

  // Update storage on value change
  useEffect(() => {
    // Skip first render and undefined values
    if (!isMounted.current) isMounted.current = true
    if (value === undefined) storageRemove(storageType, storageKey, options.verbose)
    if (shouldFallback.current || !isMounted.current || value === undefined) return

    // Serialize value once before saving and checking if serializable
    const serializedValue = serializeValue(value)
    checkIfSerializable(serializedValue, !options.silent) // Verbose when changing values

    // Update or remove value in storage
    storageSet(storageType, storageKey, serializedValue, options.verbose)
  }, [value])

  // Return state management
  return [value, setValue]
}
