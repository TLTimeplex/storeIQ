import { _SIQ_Location } from "../enum/Location";

export interface _SIQ_RegisterData {
  location: _SIQ_Location;
  /**ID of session to last */
  session?: Number;
  /**Date at which it will expire */
  expires?: Number;
}