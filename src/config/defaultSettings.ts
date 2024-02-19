import { _SIQ_Settings } from "../interfaces/Settings";

// The default settings for the QIS class
export const _SIQ_defaultSettings: _SIQ_Settings = {
  debug: false,
  webStorageThreshold: 1000,
  shutter: {
    enabled: true,
    interval: 100,
    timeout: 150,
  }
}