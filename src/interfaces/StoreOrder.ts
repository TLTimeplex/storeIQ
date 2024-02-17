import { _SIQ_Location } from "../enum/Location";

export interface _SIQ_StoreOrder {
  key: string;
  value: any;
  location: _SIQ_Location;
  options?: any; // TODO: Add options here
}