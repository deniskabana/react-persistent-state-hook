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
import { DEFAULT_OPTIONS, generateStorageKey, serializeValue } from "./utils/utils"
import { info } from "./utils/console"

// TYPES AND OPTIONS
// --------------------------------------------------

/** Purge state from storage and by default also current state. */
export type PurgeMethod = (newState?: unknown) => void

/** **WARNING:** Version `<=2` only supports [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). */
export type StorageType = "local" | "session"

/** Options API to change behavior */
export type Options = {
  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean

  /** A unique key used to store the state value in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
   *  @default undefined */
  storageKey: string | undefined

  /** * The type of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to use (either "session" or "local").
   *  @default "local" */
  storageType: StorageType
}

// OVERLOADS AND JSDOC
// --------------------------------------------------

/**
 * `usePersistentState` is a custom React hook that provides a drop-in replacement for `React.useState`.
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), such as `localStorage` or `sessionStorage`.
 * ---
 * @param {S | (() => S)} initialState - The initial state value or a function that returns it.
 * @param {Partial<Options>} [options=defaultOptions] - Configuration options for the hook.
 * ---
 * @returns {[S, Dispatch<SetStateAction<S>>,PurgeMethod]} The same array as returned by `React.useState` with the addition of a purge method.
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
 * <S>(initialState: S | (() => S), options?: Options) => [S, Dispatch<SetStateAction<S>>, PurgeMethod]
 * ```
 */
export function usePersistentState<S>(
  initialState: S | (() => S),
  options?: Partial<Options>,
): [S, Dispatch<SetStateAction<S>>, PurgeMethod]

/**
 * `usePersistentState` is a custom React hook that provides a drop-in replacement for `React.useState`.
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), such as `localStorage` or `sessionStorage`.
 * ---
 * @param {undefined} initialState - The initial state value or a function that returns it.
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
 * <S = undefined>(initialState: undefined, options?: Options) => [S | undefined, Dispatch<SetStateAction<S | undefined>>, PurgeMethod]
 * ```
 */
export function usePersistentState<S = undefined>(
  initialState: undefined,
  options?: Partial<Options>,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>]

// USE PERSISTENT STATE HOOK
// --------------------------------------------------

export function usePersistentState(initialState: unknown, options: Partial<Options> = DEFAULT_OPTIONS) {
  const config: Options = { ...DEFAULT_OPTIONS, ...options }
  const storageKey = generateStorageKey(config, initialState)
  const { verbose, storageType } = config // Used too much

  // Use React.useState internally
  const [value, setValue] = useState(() => {
    initialState = typeof initialState === "function" ? (initialState as () => unknown)() : initialState
    if (!storageKey) return initialState
    return storageGet(storageType, storageKey, initialState, verbose) ?? initialState
  })

  const isMounted = useRef(false) // Remember if we are past first render
  const shouldFallback = useRef(false) // Remember whether graceful fallback is necessary

  // Initial one-time checks - all verbose
  useEffect(() => {
    if (
      checkMissingStorageKey(storageKey, verbose) ||
      checkStorageType(storageType, verbose) ||
      checkWindow(verbose) ||
      checkBrowserStorage(verbose)
    ) {
      shouldFallback.current = true
    }

    if (verbose) info("Initializing...", { storageKey, storageType, config })
  }, [])

  // Update storage on value change
  useEffect(() => {
    if (verbose) info("Value change event", { storageKey, storageType, value })

    if (shouldFallback.current || !storageKey) return
    if (!isMounted.current || value === undefined) {
      isMounted.current = true
      if (value === undefined) storageRemove(storageType, storageKey, verbose)
      return
    }

    const serializedValue = serializeValue(value, verbose)
    if (!checkIfSerializable(serializedValue, verbose)) return
    storageSet(storageType, storageKey, serializedValue, verbose) // Update or remove value in storage
  }, [value])

  // Purge state from storage and optionally replace state
  const purgeValue = useCallback((newState?: unknown) => {
    if (verbose) info("Purging storage...", { storageKey, storageType })

    storageRemove(storageType, storageKey, verbose)
    if (newState) setValue(newState)
  }, [])

  return [value, setValue, purgeValue]
}
