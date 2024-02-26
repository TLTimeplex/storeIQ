import { _SIQ_AsyncStorageQueue } from "../systems/AsyncStorageQueue";
import { _SIQ_ErrorHandler } from "../systems/ErrorHandler";
import { _SIQ_Register } from "../systems/Register";
import { _SIQ_IndexedDBController } from "../systems/storage/indexedDB";

import { _SIQ_Settings } from "./Settings";

export interface _SIQ_Intern {
  MemoryMap: Map<string, any>;
  Settings: _SIQ_Settings;
  Queue: _SIQ_AsyncStorageQueue;
  Register: _SIQ_Register;
  ErrorHandler: _SIQ_ErrorHandler;
  SessionID: number;
  IndexDBStorage: _SIQ_IndexedDBController;
}