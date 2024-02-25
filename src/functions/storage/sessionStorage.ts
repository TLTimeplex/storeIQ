export function _SIQ_setSessionStorage(key: string, data: any) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function _SIQ_getSessionStorage(key: string): any {
  const data = sessionStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export function _SIQ_removeSessionStorage(key: string) {
  sessionStorage.removeItem(key);
}

export function _SIQ_clearSessionStorage(keys: string[]) {
  keys.forEach(key => {
    sessionStorage.removeItem(key);
  });
}

export function _SIQ_clearAllSessionStorage() {
  sessionStorage.clear();
}

