import { _SIQ_EntryOptions } from "../interfaces/EntryOptions";

import { _SIQ_Intern } from "../interfaces/Intern";

export function _SIQ_setItem(intern: _SIQ_Intern, key: string, value: any, options?: _SIQ_EntryOptions): Promise<void> {
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