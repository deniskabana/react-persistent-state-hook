import { Options } from "./types"
import { getStorage } from "./utils"

export const createStorageEvent = (value: unknown, storageKey: any, options: Partial<Options>) => {
  return new StorageEvent("storage", {
    storageArea: getStorage(options.storageType, options?.verbose ?? false),
    key: storageKey,
    oldValue: getStorage(options.storageType, options?.verbose ?? false)?.getItem(storageKey),
    newValue: value as any,
    url: window.location.href,
  })
}
