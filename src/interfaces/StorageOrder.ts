import { _SIQ_Location } from "../enum/Location";

export interface _SIQ_StorageOrder {
  key: string;
  location: _SIQ_Location;
  value?: any;
  callback?: (success: boolean) => void;
  options?: _SIQ_StorageOrderOptions; // TODO: Add options here
}

/**
 * Mostly options from the EntryOptions interface
 */
export interface _SIQ_StorageOrderOptions {
  expires?: number;
  sessional?: boolean;
}