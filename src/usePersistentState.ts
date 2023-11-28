import { useState, useEffect, useRef, useCallback } from "react"
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
 * `usePersistentState` is replacement for `React.useState`;
 * It allows you to persist the state value without any configuration in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * ---
 * @param initialState - The initial state value or a function that returns it.
 * @param storageKey - A unique key used to store state value.
 * @param [options=defaultOptions] - Configuration options for the hook.
 * ---
 * @returns `React.useState`'s return with a purge method - `[value, setValue, purgeValue]`.
 * ---
 * @see {@link https://www.npmjs.com/package/react-persistent-state-hook}
 * @see {@link https://github.com/deniskabana/react-persistent-state-hook}
 * @example
 * ```ts
 * // Replace React.useState without breaking functionality - uses `localStorage`
 * const [count, setCount] = usePersistentState(0, "count")
 * const [count, setCount] = usePersistentState(() => 0, "count")
 * // 💡 Possible state management replacement with zero configuration (for small apps and UI options) ☝️
 *
 * // Easy switching between local and session storages
 * const [count, setCount] = usePersistentState(0, "unique-key", "local")
 * const [count, setCount] = usePersistentState(0, "unique-key", "session")
 *
 * // Configurable with options API
 * const [count, setCount] = usePersistentState(0, "unique-key", { verbose: true, persistent: false })
 * ```
 */
export const usePersistentState: UsePersistentState = <S>(
  initialState: S,
  storageKey: string,
  options?: Partial<Options> | undefined,
) => {
  // CONFIG AND SETUP
  // --------------------------------------------------

  // Set up mutable config - responds to changes
  const config: Options = { ...DEFAULT_OPTIONS, ...options }
  // Sanitize prefix or use default
  config.prefix = String(String(config.prefix)?.length ? config.prefix : DEFAULT_OPTIONS.prefix) // Sanitize prefix
  // Memoize storage key to prevent re-renders
  const { current: memoizedStorageKey } = useRef(generateStorageKey(storageKey, initialState, config))
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
  }, [])

  // Update storage on value or config.persistent change
  useEffect(() => {
    if (verbose) info("Value change event", { storageKey: memoizedStorageKey, storageType, value })

    // Fallbacks to non-persistent state if necessary
    if (shouldFallback.current || !memoizedStorageKey || !config.persistent) return
    if (!isMounted.current || value === undefined) {
      isMounted.current = true
      if (value === undefined) storageRemove(storageType, memoizedStorageKey, verbose)
      return
    }

    const serializedValue = serializeValue(value, verbose)
    if (!checkIfSerializable(serializedValue, verbose)) return
    storageSet(storageType, memoizedStorageKey, serializedValue, verbose)
  }, [value, config.persistent])

  // Purge state from storage and optionally replace state
  const purgeValue: PurgeMethod<S> = useCallback((newState?: S) => {
    if (verbose) info("Purging storage...", { storageKey: memoizedStorageKey, storageType })

    storageRemove(storageType, memoizedStorageKey, verbose)
    if (newState) setValue(newState)
  }, [])

  return [value, setValue, purgeValue]
}
