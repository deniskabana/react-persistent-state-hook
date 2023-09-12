import { usePersistentState } from "./usePersistentState"
import { Options, UsePersistentState } from "./utils/types"

/**
 * Create your own instance of `usePersistentState` with shared options.
 * Useful if you have to pass the same options everywhere.
 *
 * @see {@link usePersistentState}
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
  const useMiddleware: UsePersistentState = (initialState, localOptions?: Partial<Options>) => {
    return usePersistentState(initialState as any, { ...options, ...localOptions })
  }

  return useMiddleware
}
