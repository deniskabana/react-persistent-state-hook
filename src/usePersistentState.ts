import { useState, useEffect } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  checkBrowserStorage,
  checkIfSerializable,
  checkMissingStorageKey,
  checkStorageType,
  checkWindow,
} from "./checkErrors"
import { storageSet, serializeValue, storageGet, storageRemove } from "./storage"

export enum StorageType {
  Local = "local",
  Session = "session",
}

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
 * @author Denis Kabana <denis.kabana@gmail.com>
 * @description `React.useState` + BrowserStorage API for persistence
 * @license MIT
 * @linkcode https://github.com/deniskabana/react-persistent-state-hook
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey: string,
  storageType?: StorageType,
  config?: Options,
): [S, Dispatch<SetStateAction<S>>]

/**
 * > #### usePersistentState
 *
 * > A drop-in replacement for React's `useState` hook that persists value in
 * > BrowserStorage API. To enable persistence, provide a unique `storageKey`.
 *
 * @author Denis Kabana <denis.kabana@gmail.com>
 * @description `React.useState` + BrowserStorage API for persistence
 * @license MIT
 * @linkcode https://github.com/deniskabana/react-persistent-state-hook
 * @link https://www.npmjs.com/package/react-persistent-state-hook
 */
export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey: string,
  storageType?: StorageType,
  config?: Options,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// HOOK CODE
// --------------------------------------------------

export function usePersistentState(
  initialState: unknown,
  storageKey: string,
  storageType: StorageType = StorageType.Local,
  config: Options = defaultOptions,
) {
  // Initialize classic React state
  const [value, setValue] = useState(() => storageGet(storageType, storageKey, initialState) ?? initialState)

  // Merge user options with defaults
  config = { ...defaultOptions, ...config }

  // If set to verbose, log initialization
  if (config.verbose) {
    console.log("usePersistentState / init", {
      initialState,
      storageKey,
      storageType,
      config,
      value,
    })
  }

  // Initial one-time checks - all verbose
  useEffect(() => {
    checkMissingStorageKey(storageKey, true) ||
      checkStorageType(storageType, true) ||
      checkWindow(true) ||
      checkBrowserStorage(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This will not be called intentionally if initial checks won't pass
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // If set to verbose, log every change
    if (config.verbose) {
      console.log("usePersistentState / valueChange", {
        initialState,
        storageKey,
        storageType,
        config,
        value,
      })
    }

    // Undefined is not a JSON serializable value, cancel operation
    if (value === undefined) {
      storageRemove(storageType, storageKey)
      return
    }

    // Serialize value before saving
    const serializedValue = serializeValue(value)
    checkIfSerializable(serializedValue, true) // Verbose

    // Update or remove
    storageSet(storageType, storageKey, serializedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Return state management
  return [value, setValue]
}
