import { _SIQ_Flags } from "../../config/flags";
import { _SIQ_EntryOptions } from "../../interfaces/EntryOptions";

/**
 * Throws an error if the entry options are invalid
 * @param options The entry options to check
 * @returns Whether the entry options are valid
 * @throws An error if the entry options are invalid
 * @see _SIQ_Flags for the flags that control this function
 */
export function _SIQ_sanityCheck_EntryOptions(options?: _SIQ_EntryOptions) {
  if (!_SIQ_Flags._SIQ_sanityCheck_EntryOptions.isEnabled || options === undefined) {
    return;
  }

  // CHECK: expires
  if (options.expires !== undefined && _SIQ_Flags._SIQ_sanityCheck_EntryOptions.expires.isEnabled) {
    if (typeof options.expires !== "number") {
      throw new Error("SanityC: The expires option must be a number");
    }
    if (_SIQ_Flags._SIQ_sanityCheck_EntryOptions.expires.checkExpired && options.expires < Date.now()) {
      throw new Error("SanityC: The expires option must be in the future");
    }
    if (_SIQ_Flags._SIQ_sanityCheck_EntryOptions.expires.checkPositiv && options.expires < 0) {
      throw new Error("SanityC: The expires option must be a positive number");
    }
  }


}