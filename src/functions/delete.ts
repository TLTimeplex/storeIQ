import { _SIQ_Location } from "../enum/Location";
import { _SIQ_Intern } from "../interfaces/Intern";
import { _SIQ_removeItem } from "./removeItem";
import { _SIQ_removeLocalStorage } from "./storage/localStorage";
import { _SIQ_removeSessionStorage } from "./storage/sessionStorage";

export async function _SIQ_delete(intern: _SIQ_Intern): Promise<void> {
  // Cancel queued operations
  await intern.Queue.clear();

  // Get all items from the register
  const items = intern.Register.entries();

  // Clear IndexedDB
  const indexedDBClear = await intern.IndexDBStorage.clear();

  // Clear all items from the remaining storages
  for (const item of items) {
    const key = item[0], value = item[1];
    switch (value.location) {
      case _SIQ_Location.LocalStorage:
        _SIQ_removeLocalStorage(key);
        break;
      case _SIQ_Location.SessionStorage:
        _SIQ_removeSessionStorage(key);
        break;
      default:
        break;
    }
  }

  // Clear the register & temporary data
  intern.Register.clear();
  await intern.Register.saveRegister();
  intern.MemoryMap.clear();
}