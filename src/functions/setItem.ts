import { EntryOptions } from "../interfaces/EntryOptions";

import { QISIntern } from "../interfaces/QISIntern";

export function _setItem(intern: QISIntern, key: string, value: any, options?: EntryOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Set the value in the memory map
      intern.MemoryMap.set(key, value);
      // Resolve the promise
      resolve();
    }
    catch (error) {
      // Reject the promise
      reject(error);
    }
  });
}