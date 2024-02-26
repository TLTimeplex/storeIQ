export interface _SIQ_Settings {
  register: {
    autoSaveInterval: number; // in milliseconds
  }
  /** Defines the maximum size of a string saved in the Webstorages */
  webStorageThreshold: number;
  debug: boolean;
  shutter: {
    enabled: boolean;
    interval: number; // in milliseconds
    timeout: number; // in milliseconds
  }
  // TODO:
}

export interface _SIQ_Public_Settings {
  register: {
    autoSaveInterval: number; // in milliseconds
  }
  /** Defines the maximum size of a string saved in the Webstorages */
  webStorageThreshold?: number;
  debug?: boolean;
  shutter?: {
    enabled?: boolean;
    interval?: number; // in milliseconds
    timeout?: number; // in milliseconds
  }
  // TODO:
}

export function _SIQ_mergeSettings(settings: _SIQ_Public_Settings, defaults: _SIQ_Settings): _SIQ_Settings {
  return {
    register: {
      autoSaveInterval: settings.register?.autoSaveInterval || defaults.register.autoSaveInterval,
    },
    webStorageThreshold: settings.webStorageThreshold || defaults.webStorageThreshold,
    debug: settings.debug || defaults.debug,
    shutter: {
      enabled: settings.shutter?.enabled || defaults.shutter.enabled,
      interval: settings.shutter?.interval || defaults.shutter.interval,
      timeout: settings.shutter?.timeout || defaults.shutter.timeout,
    }
  }
}