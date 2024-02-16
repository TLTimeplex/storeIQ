import { QISSettings } from "./QISSettings";

export interface QISIntern {
  MemoryMap: Map<string, any>;
  Settings: QISSettings;
}