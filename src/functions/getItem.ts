import { _SIQ_Location } from "../enum/Location";
import { _SIQ_Intern } from "../interfaces/Intern";
import { _SIQ_I_removeItem } from "./removeItem";
import { _SIQ_getLocalStorage, _SIQ_removeLocalStorage } from "./storage/localStorage";
import { _SIQ_getSessionStorage, _SIQ_removeSessionStorage } from "./storage/sessionStorage";

export async function _SIQ_getItem(intern: _SIQ_Intern, key: string): Promise<any> {
  // Check if the value should exist and be accessible
  const itemInfo = intern.Register.get(key);
  if (itemInfo === undefined) {
    return null;
  }

  if (itemInfo.session !== undefined && itemInfo.session !== intern.SessionID
    || itemInfo.expires !== undefined && itemInfo.expires < new Date().getTime()) {

    await _SIQ_I_removeItem(intern, key, itemInfo);

    return null;
  }

  // Get the value from the memory map if it exists
  var value = intern.MemoryMap.get(key);
  // Else get the value from the storage
  if (value === undefined) {
    switch (itemInfo.location) {
      case _SIQ_Location.LocalStorage:
        value = _SIQ_getLocalStorage(key);
        break;
      case _SIQ_Location.SessionStorage:
        value = _SIQ_getSessionStorage(key);
        break;
      case _SIQ_Location.IndexedDB:
        value = await intern.IndexDBStorage.get(key);
        break;
      default:
        value = null;
        intern.ErrorHandler.error(new Error("Unknown storage location"));
        break;
    }
    // Set the value in the memory map for future use
    intern.MemoryMap.set(key, value);
  }
  return value;
}