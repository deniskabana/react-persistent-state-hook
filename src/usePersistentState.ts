import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
import { UsePersistentState, Options, PurgeMethod } from "./utils/types"

/**
 * `usePersistentState` is a custom React hook that provides a drop-in replacement for `React.useState`.
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), such as `localStorage` or `sessionStorage`.
 * ---
 * @param initialState - The initial state value or a function that returns it. **Keys are generated based on serialized initialState**.
 * @param storageKey - A unique key used to store the state value in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * @param [options=defaultOptions] - Configuration options for the hook.
 * ---
 * @returns The same array as returned by `React.useState` with the addition of a purge method.
 * ---
 * @description
 * This hook combines the functionality of `React.useState` with the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to provide
 * persistence for your state values across page refreshes and browser sessions.
 * It can be particularly useful for maintaining user preferences or form data.
 * ---
 * @see {@link https://www.npmjs.com/package/react-persistent-state-hook}
 * @see {@link https://github.com/deniskabana/react-persistent-state-hook}
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
 */
export const usePersistentState: UsePersistentState = <S>(
  initialState: S,
  storageKey: string,
  options?: Partial<Options> | undefined,
) => {
  const config: Options = { ...DEFAULT_OPTIONS, ...options }
  config.prefix = String(String(config.prefix)?.length ? config.prefix : DEFAULT_OPTIONS.prefix) // Sanitize prefix
  // Memoize this to prevent more serializing and hashing and to not react to run-time initialState change
  const memoizedStorageKey: string = useMemo(() => generateStorageKey(storageKey, initialState, config), [])
  const { verbose, storageType } = config

  // Use React.useState internally
  const [value, setValue] = useState<S>(() => {
    initialState = (typeof initialState === "function" ? (initialState as () => unknown)() : initialState) as S
    if (!config.persistent) return initialState
    return storageGet(storageType, memoizedStorageKey, initialState, verbose) as S
  })

  const isMounted = useRef(false) // Remember if we are past first render
  const shouldFallback = useRef(false) // Remember whether graceful fallback is necessary

  // Initial one-time checks - all verbose
  // Register StorageEvent listener
  useEffect(() => {
    if (verbose) info("Initializing...", { storageKey: memoizedStorageKey, storageType, config })

    if (
      checkMissingStorageKey(memoizedStorageKey, verbose) ||
      checkStorageType(storageType, verbose) ||
      checkWindow(verbose) ||
      checkBrowserStorage(verbose)
    ) {
      shouldFallback.current = true
    }

    const eventListener = (event: StorageEvent) => {
      if (event.key === memoizedStorageKey) {
        const parsedValue = event.newValue?.length ? JSON.parse(event.newValue) : value
        if (value !== parsedValue) setValue(parsedValue)
      }
    }

    // Register StorageEvent listener
    if (typeof window !== "undefined") window.addEventListener("storage", eventListener)
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("storage", eventListener)
    }
  }, [])

  // Update storage on value or config.persistent change
  useEffect(() => {
    if (verbose) info("Value change event", { storageKey: memoizedStorageKey, storageType, value })

    if (shouldFallback.current || !memoizedStorageKey || !config.persistent) return
    if (!isMounted.current || value === undefined) {
      isMounted.current = true
      if (value === undefined) storageRemove(storageType, memoizedStorageKey, verbose)
      return
    }

    const serializedValue = serializeValue(value, verbose)
    if (!checkIfSerializable(serializedValue, verbose)) return
    storageSet(storageType, memoizedStorageKey, serializedValue, verbose) // Update or remove value in storage
  }, [value, config.persistent])

  // Purge state from storage and optionally replace state
  const purgeValue: PurgeMethod<S> = useCallback((newState?: S) => {
    if (verbose) info("Purging storage...", { storageKey: memoizedStorageKey, storageType })

    storageRemove(storageType, memoizedStorageKey, verbose)
    if (newState) setValue(newState)
  }, [])

  return [value, setValue, purgeValue]
}
