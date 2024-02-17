import { _SIQ_Settings } from "../interfaces/Settings";

// The default settings for the QIS class
export const _SIQ_defaultSettings: _SIQ_Settings = {
  debug: false,
  shutter: {
    enabled: true,
    interval: 100,
    timeout: 150,
  }
}