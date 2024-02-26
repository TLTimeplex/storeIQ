import { _SIQ_Location } from "../enum/Location";
import { _SIQ_Intern } from "../interfaces/Intern";
import { _SIQ_RegisterData } from "../interfaces/RegisterData";
import { _SIQ_removeLocalStorage } from "./storage/localStorage";
import { _SIQ_removeSessionStorage } from "./storage/sessionStorage";

export async function _SIQ_removeItem(intern: _SIQ_Intern, key: string): Promise<void> {
  const itemInfo = intern.Register.get(key);

  if (itemInfo === undefined) {
    return;
  }

  await _SIQ_I_removeItem(intern, key, itemInfo);
}

export async function _SIQ_I_removeItem(intern: _SIQ_Intern, key: string, itemInfo: _SIQ_RegisterData): Promise<void> {

  // Remove temporary items that have expired
  intern.MemoryMap.delete(key);

  // Remove the item from the storage
  switch (itemInfo.location) {
    case _SIQ_Location.LocalStorage:
      _SIQ_removeLocalStorage(key);
      break;
    case _SIQ_Location.SessionStorage:
      _SIQ_removeSessionStorage(key);
      break;
    case _SIQ_Location.IndexedDB:
      intern.IndexDBStorage.delete(key);
      break;
    default:
      intern.ErrorHandler.error(new Error("Unknown storage location"));
      break;
  }

  // Remove the item from the register
  intern.Register.delete(key);
}