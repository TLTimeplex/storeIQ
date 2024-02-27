import { _SIQ_Location } from "../enum/Location";
import { _SIQ_Intern } from "../interfaces/Intern";

export async function _SIQ_delete(intern: _SIQ_Intern): Promise<void> {
  // Cancel queued operations
  intern.Queue.clear();

  // Get all items from the register
  const items = intern.Register.entries();

  // Clear IndexedDB
  const indexedDBClear =  intern.IndexDBStorage.clear();

  // Clear all items from the remaining storages
  for (const item of items) {
    const key = item[0], value = item[1];
    switch (value.location) {
      case _SIQ_Location.LocalStorage:
        localStorage.removeItem(key);
        break;
      case _SIQ_Location.SessionStorage:
        sessionStorage.removeItem(key);
        break;
      default:
        break;
    }
  }

  // Clear the register & temporary register
  intern.Register.clear();
  intern.MemoryMap.clear();

  // Wait for all promises to resolve
  await indexedDBClear;

}