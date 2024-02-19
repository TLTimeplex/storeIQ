import { _SIQ_Location } from "../enum/Location";
import { _SIQ_EntryOptions } from "../interfaces/EntryOptions";

import { _SIQ_Intern } from "../interfaces/Intern";
import { _SIQ_StorageOrder } from "../interfaces/StorageOrder";
import { _SIQ_sanityCheck_EntryOptions } from "./sanityCheck/sanityCheck_EntryOptions";

export function _SIQ_setItem(intern: _SIQ_Intern, key: string, value: any, options?: _SIQ_EntryOptions): Promise<void> {
  return new Promise((resolve, _) => {
    try {
      _SIQ_sanityCheck_EntryOptions(options);

      // Set the value in the memory map
      intern.MemoryMap.set(key, value);

      // Decide which storage location to use
      var storageLocation: _SIQ_Location = _SIQ_Location.LocalStorage;


      if (value === null || value === undefined) {
        // storageLocation = _SIQ_Location.LocalStorage;
      } else if (value instanceof Object) {
        storageLocation = _SIQ_Location.IndexedDB;
      } else if (typeof value === "string" && value.length > intern.Settings.webStorageThreshold) {
        storageLocation = _SIQ_Location.IndexedDB;
      }

      if (options !== undefined && options.sessional !== undefined && options.sessional && storageLocation === _SIQ_Location.LocalStorage) {
        // If the expires option is set, use the session storage
        storageLocation = _SIQ_Location.SessionStorage;
      }

      // Create the storage order
      const storageOrder: _SIQ_StorageOrder = {
        key: key,
        location: storageLocation,
        value: value,
        options: {
          expires: options?.expires,
          sessional: options?.sessional
        },
        callback: (success: boolean) => {
          if (success) {
            resolve();
          } else {
            intern.ErrorHandler.error(new Error("Failed to store the value"));
            resolve();
          }
        }
      };

      // Add the storage order to the queue
      intern.Queue.addOrder(storageOrder);
    }
    catch (error) {
      intern.ErrorHandler.error(error as Error);
      resolve();
    }
  });
}
