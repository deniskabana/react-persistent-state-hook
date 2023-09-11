import { useState, useEffect, useRef, useCallback } from "react"
import type { Dispatch, SetStateAction } from "react"
import {
  checkBrowserStorage,
  checkIfSerializable,
  checkMissingStorageKey,
  checkStorageType,
  checkWindow,
} from "./utils/checkErrors"
import { storageSet, storageGet, storageRemove } from "./utils/storage"
import { serializeValue } from "./utils/utils"

// TYPES AND OPTIONS
// --------------------------------------------------

/** Purge state from storage and by default also current state. */
export type PurgeMethod = (newState?: unknown) => void

/** **WARNING:** Version `<=2` only supports [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). */
export type StorageType = "local" | "session"

/** Options API to change behavior */
export type Options = {
  /** Silently swallow all (even user) errors.
   *  @default process.env.NODE_ENV === "production" */
  silent: boolean

  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean

  /** Prefix is used to prevent key collisions in storage.
   *  @pattern `/[0-9A-Za-z-_@/]+:/` (similar to npm package names)
   *  @default "persistent-state:" */
  prefix: string
}

const defaultOptions: Options = {
  verbose: false,
  silent: process.env.NODE_ENV === "production",
  prefix: "persistent-state:",
}

// OVERLOADS AND JSDOC
// --------------------------------------------------

/**
 * `usePersistentState` is a custom React hook that provides a drop-in replacement for `React.useState`.
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), such as `localStorage` or `sessionStorage`.
 * ---
 * @param {S | (() => S)} initialState - The initial state value or a function that returns it.
 * @param {string} storageKey - A unique key used to store the state value in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * @param {StorageType} [storageType="session"] - The type of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to use (either "session" or "local").
 * @param {Partial<Options>} [options=defaultOptions] - Configuration options for the hook.
 * ---
 * @returns {[S, Dispatch<SetStateAction<S>,PurgeMethod]} The same array as returned by `React.useState` with the addition of a purge method.
 * ---
 * @description
 * This hook combines the functionality of `React.useState` with the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to provide
 * persistence for your state values across page refreshes and browser sessions.
 * It can be particularly useful for maintaining user preferences or form data.
 * ---
 * @see [npm package](https://www.npmjs.com/package/react-persistent-state-hook) `react-persistent-state-hook`
 * @link [github.com/deniskabana/react-persistent-state-hook](https://github.com/deniskabana/react-persistent-state-hook)
 * ---
 * @example
 * ```ts
 * // Replace React.useState without breaking functionality
 * const [count, setCount] = usePersistentState(0)
 * const [count, setCount] = usePersistentState(() => 0)
 *
 * // Add a unique key to persist state - uses sessionStorage by default
 * const [count, setCount] = usePersistentState(0, "unique-key")
 * // 💡 Possible Redux replacement with zero configuration (for small apps and UI options) ☝️
 *
 * // Easy switching between localStorage and sessionStorage
 * const [count, setCount] = usePersistentState(0, "unique-key", "local")
 *
 * // Configurable with options API
 * const [count, setCount] = usePersistentState(0, "unique-key", { verbose: true })
 * ```
 * ---
 * @typedef {typeof usePersistentState} usePersistentState - Has 2 overloads.
 * ```ts
 * <S>(initialState: S | (() => S), storageKey?: string, storageType?: StorageType, options?: Options) => [S, Dispatch<SetStateAction<S>>, PurgeMethod]
 * ```
 */
export function usePersistentState<S>(
  initialState: S | (() => S),
  storageKey?: string,
  storageType?: StorageType,
  options?: Partial<Options>,
): [S, Dispatch<SetStateAction<S>>, PurgeMethod]

/**
 * `usePersistentState` is a custom React hook that provides a drop-in replacement for `React.useState`.
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), such as `localStorage` or `sessionStorage`.
 * ---
 * @param {undefined} initialState - The initial state value or a function that returns it.
 * @param {string} storageKey - A unique key used to store the state value in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * @param {StorageType} [storageType="session"] - The type of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to use (either "session" or "local").
 * @param {Partial<Options>} [options=defaultOptions] - Configuration options for the hook.
 * ---
 * @returns {[S | undefined, Dispatch<SetStateAction<S | undefined>>,PurgeMethod]} The same array as returned by `React.useState` with the addition of a purge method.
 * ---
 * @description
 * This hook combines the functionality of `React.useState` with the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to provide
 * persistence for your state values across page refreshes and browser sessions.
 * It can be particularly useful for maintaining user preferences or form data.
 * ---
 * @see react-persistent-state-hook [npm package](https://www.npmjs.com/package/react-persistent-state-hook)
 * @link [github.com/deniskabana/react-persistent-state-hook](https://github.com/deniskabana/react-persistent-state-hook)
 * ---
 * @example
 * ```ts
 * // Replace React.useState without breaking functionality
 * const [count, setCount] = usePersistentState(0)
 * const [count, setCount] = usePersistentState(() => 0)
 *
 * // Add a unique key to persist state - uses sessionStorage by default
 * const [count, setCount] = usePersistentState(0, "unique-key")
 * // 💡 Possible Redux replacement with zero configuration (for small apps and UI options) ☝️
 *
 * // Easy switching between localStorage and sessionStorage
 * const [count, setCount] = usePersistentState(0, "unique-key", "local")
 *
 * // Configurable with options API
 * const [count, setCount] = usePersistentState(0, "unique-key", { verbose: true })
 * ```
 * ---
 * @typedef {typeof usePersistentState} usePersistentState - Has 2 overloads.
 * ```ts
 * <S = undefined>(initialState: undefined, storageKey?: string, storageType?: StorageType, options?: Options) => [S | undefined, Dispatch<SetStateAction<S | undefined>>, PurgeMethod]
 * ```
 */
export function usePersistentState<S = undefined>(
  initialState: undefined,
  storageKey?: string,
  storageType?: StorageType,
  options?: Partial<Options>,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// USE PERSISTENT STATE HOOK
// --------------------------------------------------

export function usePersistentState(
  initialState: unknown,
  storageKey: string = "",
  storageType: StorageType = "session",
  options: Partial<Options> = defaultOptions,
) {
  const config: Options = { ...defaultOptions, ...options }
  config.silent = config.verbose || config.silent // Disable silent mode if verbose is enabled

  // Add prefix if missing (for backwards compatibility)
  storageKey = storageKey.startsWith(config.prefix) ? storageKey : config.prefix + storageKey

  // Use React.useState internally
  const [value, setValue] = useState(() => {
    initialState = typeof initialState === "function" ? (initialState as () => unknown)() : initialState
    return storageGet(storageType, storageKey, initialState, config.verbose) ?? initialState
  })

  const isMounted = useRef(false) // Remember if we are past first render
  const shouldFallback = useRef(false) // Remember whether graceful fallback is necessary

  // Initial one-time checks - all verbose
  useEffect(() => {
    checkMissingStorageKey(storageKey, !config.silent) ||
      checkStorageType(storageType, !config.silent) ||
      checkWindow(!config.silent) ||
      checkBrowserStorage(!config.silent)

    shouldFallback.current = true
  }, [])

  // Update storage on value change
  useEffect(() => {
    // Skip first render and undefined values
    if (!isMounted.current) isMounted.current = true
    if (value === undefined) storageRemove(storageType, storageKey, config.verbose)
    if (shouldFallback.current || !isMounted.current || value === undefined) return

    // Serialize value once before saving and checking if serializable
    const serializedValue = serializeValue(value)
    if (!checkIfSerializable(serializedValue, !config.silent)) return

    // Update or remove value in storage
    storageSet(storageType, storageKey, serializedValue, config.verbose)
  }, [value])

  const purgeValue = useCallback((newState?: unknown) => {
    storageRemove(storageType, storageKey, config.verbose)
    if (newState) setValue(newState)
  }, [])

  // Return state management
  return [value, setValue, purgeValue]
}
