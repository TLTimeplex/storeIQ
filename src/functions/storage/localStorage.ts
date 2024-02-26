/**
 * Sets the value of the specified key in the local storage.
 * @param key - The key to set.
 * @param data - The data to store.
 */
export function _SIQ_setLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieves the value associated with the specified key from the local storage.
 * @param key - The key to retrieve.
 * @returns The value associated with the key, or null if the key does not exist.
 */
export function _SIQ_getLocalStorage(key: string): any {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

/**
 * Removes the value associated with the specified key from the local storage.
 * @param key - The key to remove.
 */
export function _SIQ_removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}

/**
 * Removes multiple values from the local storage based on the specified keys.
 * @param keys - An array of keys to remove.
 */
export function _SIQ_clearLocalStorage(keys: string[]) {
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Clears all values from the local storage.
 */
export function _SIQ_clearAllLocalStorage() {
  localStorage.clear();
}
