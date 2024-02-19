export interface _SIQ_Settings {
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