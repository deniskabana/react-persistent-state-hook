export const RPSH_EVENT = "rpsh-event"

/**
 * Custom event triggered for component synchronization
 */
export const createCustomEvent = (storageKey: string, instanceId: string) =>
  new CustomEvent(RPSH_EVENT, {
    detail: { storageKey, instanceId },
  })
