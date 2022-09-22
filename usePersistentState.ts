/**
 * @author Denis Kabana <github.com/deniskabana>
 * @license MIT
 * @description Persistent state hook that mimics React's own useState and internally adds storage management
 * @requires React, ./StorageHelper.ts
 */

// IMPORTS
// ----------------------------------------------------------------------

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import storage, { StorageTypes } from "./StorageHelper.ts";

// TYPES
// ----------------------------------------------------------------------

type InitialState<S> = S | (() => S);
type StorageKey = string;
type ReturnType<S> = [S, Dispatch<SetStateAction<S>>];

// OVERLOADS
// ----------------------------------------------------------------------

// Overload to allow undefined type - comfortable inferrence exactly like useState does
function usePersistentState<S = undefined>(
  initialState: InitialState<S> | undefined,
  storageKey: StorageKey,
  storageType?: StorageTypes
): [S, Dispatch<SetStateAction<S | undefined>>];

// COMPONENT
// ----------------------------------------------------------------------

/**
 * State with persistent values - uses an implicit middleware to handle storage API
 * - When no `storageKey` provided, acts the same as `React.useState` and **prints run-time console error**
 * @param initialState React state - only JSON valid objects!
 * @param storageKey It is **IMPERATIVE** that you provide a unique storage key identifier
 * @param storageType Whether persisting for only session or forever
 * @example const [value, setValue] = usePersistentState(JSONValidValue, 'unique-identifier');
 * @example const [value, setValue] = usePersistentState<number>(JSONValidValue, 'unique-identifier');
 * @example const [value, setValue] = usePersistentState(JSONValidValue, 'unique-identifier', StorageTypes.session);
 * @returns `ReturnType<React.useState<S>>`
 */
function usePersistentState<S>(
  initialState: InitialState<S>,
  storageKey: StorageKey,
  storageType: StorageTypes = StorageTypes.local
): ReturnType<S> {
  // Unfortunate extra state for initialization management; Faster than ref, safer than window.customVar
  const [initialized, setInitialized] = useState(false);
  let initialValue = initialState;

  // Load data from storage on mount
  if (!initialized) {
    if (storageKey?.length) {
      const newValue = storage(storageType).get(storageKey);
      // Upon retrieving a new value, set it to React state
      if (newValue !== "" && typeof newValue !== "undefined") {
        initialValue = newValue;
      } else {
        storage(storageType).set(storageKey, initialState);
      }
    }
    // Prevent further intialization
    setInitialized(true);
  }

  // Actual react hook code
  const [value, setValue] = useState<S>(initialValue);

  // Save new data when changed
  useEffect(() => {
    if (storageKey?.length) {
      storage(storageType).set(storageKey, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}

export default usePersistentState;
