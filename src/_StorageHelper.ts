export enum StorageTypes {
  local = "local",
  session = "session",
}

/**
 * Browser storage handler
 * @param storageType Whether to use local / session browser storage
 * @returns get/set handlers
 */
export default function storage(storageType: StorageTypes) {
  // Do not use server-side
  if (typeof window === "undefined") {
    return {
      get: (..._args: any[]) => null,
      set: (..._args: any[]) => null,
      delete: (..._args: any[]) => null,
    };
  }

  /**
   * Returns parsed data from selected storage; Fails with console.error
   * @param key Item key
   */
  function storageGet(key: string): any {
    const storageHandler = window[`${storageType}Storage`] ?? window.sessionStorage;
    const storedData = storageHandler.getItem(key);

    let parsedData;
    try {
      parsedData = JSON.parse(storedData ?? "");
    } catch (error) {
      console.error(error);
    }

    return parsedData;
  }

  /**
   * Returns void, saves data, stringifies in background
   * @param key Item key
   */
  function storageSet(key: string, value: any): void {
    const storageHandler = window[`${storageType}Storage`] ?? window.sessionStorage;
    const stringifiedData = JSON.stringify(value);
    storageHandler.setItem(key, stringifiedData);
  }

  /**
   * Returns void, deletes storage by key
   * @param key Item key
   */
  function storageDelete(key: string): void {
    const storageHandler = window[`${storageType}Storage`] ?? window.sessionStorage;
    storageHandler.removeItem(key);
  }

  return {
    get: storageGet,
    set: storageSet,
    delete: storageDelete,
  };
}
