import { useState, useEffect } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  checkBrowserStorage,
  checkIfSerializable,
  checkMissingStorageKey,
  checkStorageType,
  checkWindow,
} from "./checkErrors"
import { storageRemove, storageSet, serializeValue } from "./storage"

export enum StorageType {
  local = "local",
  session = "session",
}

// Overloads modified from React v16.8.0 `useState` hook
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
  storageType: StorageType = StorageType.local,
) {
  // Initialize classic React state
  const [value, setValue] = useState(initialState)

  // Resort to React useState if necessary
  if (checkMissingStorageKey() || checkStorageType(storageType) || checkWindow() || checkBrowserStorage()) {
    return [value, setValue]
  }

  // Update value in storage when changed
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
  }, [value])

  // Return state management
  return [value, setValue]
}

//   if (!storageKey) {
//     return [value, setValue]
//   }

//   // Unfortunate extra state for initialization management; Faster than ref, safer than window.customVar
//   const [initialized, setInitialized] = useState(false)
//   let initialValue = initialState

//   // Load data from storage on mount
//   if (!initialized) {
//     if (storageKey?.length) {
//       const newValue = storage(storageType).get(storageKey)
//       // Upon retrieving a new value, set it to React state
//       if (newValue !== "" && typeof newValue !== "undefined") {
//         initialValue = newValue
//       } else {
//         storage(storageType).set(storageKey, initialState)
//       }
//     }
//     // Prevent further intialization
//     setInitialized(true)
//   }

//   // Save new data when changed
//   useEffect(() => {
//     if (storageKey?.length) {
//       storage(storageType).set(storageKey, value)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value])

//   return [value, setValue]
// }

// export default usePersistentState
