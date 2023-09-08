import { useState, useEffect } from "react"
import type { Dispatch, SetStateAction } from "react"
import { error, warn } from "./errors"
import isEqual from "lodash.isequal"

// TYPES
// ----------------------------------------------------------------------

type StorageKey = string

enum StorageType {
  local = "local",
  session = "session",
}

// Overloads modified from React v16.8.0 `useState` hook
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey: StorageKey,
  storageType?: StorageType,
): [S, Dispatch<SetStateAction<S>>]

export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey: StorageKey,
  storageType?: StorageType,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// COMPONENT
// ----------------------------------------------------------------------

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
export default function usePersistentState(
  initialState: any,
  storageKey: StorageKey,
  storageType: StorageType = StorageType.local,
) {
  // Initialize classic React state
  const [value, setValue] = useState(initialState)

  // Guard clause if storage key was not provided
  if (!storageKey?.length) {
    warn("No storage key provided. Resorted to `React.useState`.")
    return [value, setValue]
  }

  // Update/remove value in storage when changed
  useEffect(() => {
    // Check if running in non-broswer environment
    if (typeof window === "undefined") return

    // Check if environment supports BrowserStorage
    if (!("localStorage" in window) && !("sessionStroage" in window)) {
      warn("You are running in an environment that does not support BrowserStorage API.")
      return
    }

    // If value is undefined, remove key from storage
    if (!value?.length) {
      window[`${storageType}Storage`].removeItem(storageKey)
      return
    }

    // Check if value is serializable and failsafe it
    let stringifiedValue: string | undefined = String(JSON.stringify(value))
    stringifiedValue = stringifiedValue === "undefined" ? undefined : (stringifiedValue as string)

    // Check if object is serializable
    // if (!isEqual(value, JSON.parse(stringifiedValue))) {
    //   warn("Provided state value is not serializable.")
    // }

    try {
      window[`${storageType}Storage`].setItem(storageKey, String(JSON.stringify(value)))
    } catch (_err) {
      error("Failed to save state to BrowserStorage.")
    }
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
