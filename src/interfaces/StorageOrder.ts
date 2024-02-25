import { _SIQ_Location } from "../enum/Location";

export interface _SIQ_StorageOrder {
  key: string;
  location: _SIQ_Location;
  value?: any;
  callback?: (success: boolean) => void;
}