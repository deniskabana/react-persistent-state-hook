import { useState, useEffect } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  checkBrowserStorage,
  checkIfSerializable,
  checkMissingStorageKey,
  checkStorageType,
  checkWindow,
} from "./checkErrors"
import { storageRemove, storageSet, serializeValue, storageGet } from "./storage"

export enum StorageType {
  Local = "local",
  Session = "session",
}

// Overloads taken from React v16.8.0 `useState` hook
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey: string,
  storageType?: StorageType,
): [S, Dispatch<SetStateAction<S>>]

export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey: string,
  storageType?: StorageType,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

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
export function usePersistentState(
  initialState: any,
  storageKey: string,
  storageType: StorageType = StorageType.Local,
) {
  // Initialize classic React state
  const [value, setValue] = useState(() => storageGet(storageType, storageKey, initialState) ?? initialState)

  // Initial one-time checks
  useEffect(() => {
    checkMissingStorageKey(storageKey) || checkStorageType(storageType) || checkWindow() || checkBrowserStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This will not be called intentionally if initial checks won't pass
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!value?.length) {
      storageRemove(storageType, storageKey)
      return
    }
    // Serialize value before saving
    const serializedValue = serializeValue(value)
    checkIfSerializable(serializedValue)
    // Update or remove
    storageSet(storageType, storageKey, serializedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Return state management
  return [value, setValue]
}
