import type { Dispatch, SetStateAction } from "react"

/** Purge state from storage and by default also current state. */
export type PurgeMethod<S> = (newState?: S) => void

/** **WARNING:** Version `<=2` only supports [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). */
export type StorageType = "local" | "session"

/** Options API to change behavior */
export type Options = {
  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean

  /** The type of Web Storage API to use (either "session" or "local").
   *  @default "local" */
  storageType: StorageType

  /** Allow programatically enabling and disabling persistence in-place.
   *  @default true */
  persistent: boolean

  /** Allow the use of custom key prefix - group contexts or invalidate state version.
   *  @default "[rpsh]" */
  prefix: string
}

export type UsePersistentState = {
  <S>(
    initialState: S | (() => S),
    storageKey: string,
    options?: Partial<Options>,
  ): [S, Dispatch<SetStateAction<S>>, PurgeMethod<S>]
  <S = undefined>(
    initialState: undefined,
    storageKey: string,
    options?: Partial<Options>,
  ): [S | undefined, Dispatch<SetStateAction<S | undefined>>, PurgeMethod<S>]
}
