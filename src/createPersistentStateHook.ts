import { Options, usePersistentState } from "./usePersistentState"

/**
 * Create your own instance of `usePersistentState` with shared options.
 * Useful if you have to pass the same options everywhere.
 *
 * @example
 * ```typescript
 * import { createPersistentStateHook } from "use-persistent-state"
 * export const usePersistentState = createPersistentStateHook({
 *   storageType: "local",
 *   verbose: true,
 * })
 * ```
 */
export function createPersistentStateHook(options?: Partial<Options>) {
  return function <S>(initialState: S, localOptions?: Partial<Options>) {
    return usePersistentState<S>(initialState, { ...options, ...localOptions })
  }
}
