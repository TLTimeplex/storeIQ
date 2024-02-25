export function _SIQ_setLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function _SIQ_getLocalStorage(key: string): any {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export function _SIQ_removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function _SIQ_clearLocalStorage(keys: string[]) {
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
}

export function _SIQ_clearAllLocalStorage() {
  localStorage.clear();
}