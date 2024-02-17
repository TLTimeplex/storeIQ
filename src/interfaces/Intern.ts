import { _SIQ_ErrorHandler } from "../systems/ErrorHandler";
import _SIQ_SaveQueue from "../systems/SaveQueue";
import { _SIQ_Settings } from "./Settings";

export interface _SIQ_Intern {
  MemoryMap: Map<string, any>;
  Settings: _SIQ_Settings;
  Queue: _SIQ_SaveQueue;
  ErrorHandler: _SIQ_ErrorHandler;
}