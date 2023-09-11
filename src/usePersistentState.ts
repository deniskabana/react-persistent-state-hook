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

export enum StorageType {
  Local = "local",
  Session = "session",
}

export type StorageTypeArg = StorageType | "local" | "session" | string

// Options for use configuration

export type Options = Partial<{
  verbose: boolean
}>

const defaultOptions: Options = {
  verbose: false,
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
 * @param config - Configuration options
 *
 * @description `React.useState` + BrowserStorage API for persistence
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey: string,
  storageType?: StorageTypeArg,
  config?: Options,
): [S, Dispatch<SetStateAction<S>>]

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
 * @param config - Configuration options
 *
 * @description `React.useState` + BrowserStorage API for persistence
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey: string,
  storageType?: StorageTypeArg,
  config?: Options,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// HOOK CODE
// --------------------------------------------------

export function usePersistentState(
  initialState: unknown,
  storageKey: string,
  storageType: StorageTypeArg = StorageType.Session,
  config: Options = defaultOptions,
) {
  // Initialize classic React state
  const [value, setValue] = useState(() => storageGet(storageType, storageKey, initialState) ?? initialState)

  const isMounted = useRef(false) // Remember if we are past our first render
  const shouldFallback = useRef(false) // Remember if we should fallback to useState

  // Merge user options with defaults
  // TODO: Consider using this API or keep it in reserve
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config = { ...defaultOptions, ...config }

  // Initial one-time checks - all verbose
  useEffect(() => {
    checkMissingStorageKey(storageKey, true) ||
      checkStorageType(storageType, true) ||
      checkWindow(true) ||
      checkBrowserStorage(true)

    shouldFallback.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (shouldFallback.current) return

    // Skip first render
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    // Undefined is not a JSON serializable value, cancel operation
    if (value === undefined) {
      storageRemove(storageType, storageKey)
      return
    }

    // Serialize value before saving
    const serializedValue = serializeValue(value)
    checkIfSerializable(serializedValue, true) // Verbose

    // Update or remove value in storage
    storageSet(storageType, storageKey, serializedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Return state management
  return [value, setValue]
}
