/**
 * Sets the value of a session storage item.
 * @param key - The key of the item.
 * @param data - The data to be stored.
 */
export function _SIQ_setSessionStorage(key: string, data: any) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieves the value of a session storage item.
 * @param key - The key of the item.
 * @returns The stored data, or null if the item does not exist.
 */
export function _SIQ_getSessionStorage(key: string): any {
  const data = sessionStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

/**
 * Removes a session storage item.
 * @param key - The key of the item to be removed.
 */
export function _SIQ_removeSessionStorage(key: string) {
  sessionStorage.removeItem(key);
}

/**
 * Removes multiple session storage items.
 * @param keys - An array of keys of the items to be removed.
 */
export function _SIQ_clearSessionStorage(keys: string[]) {
  keys.forEach(key => {
    sessionStorage.removeItem(key);
  });
}

/**
 * Clears all session storage items.
 */
export function _SIQ_clearAllSessionStorage() {
  sessionStorage.clear();
}
