import { _SIQ_EntryOptions } from "../interfaces/EntryOptions";
import { _SIQ_Intern } from "../interfaces/Intern";
import { _SIQ_sanityCheck_EntryOptions } from "./sanityCheck/sanityCheck_EntryOptions";

export async function _SIQ_setOptions(intern:_SIQ_Intern, key: string, options: _SIQ_EntryOptions) {
  try {
    var _options = intern.Register.get(key);

    if (!_options) {
      throw new Error('No such key');
    }

    _SIQ_sanityCheck_EntryOptions(options);

    if (options.expires) {
      _options.expires = options.expires;
    }
    if (options.sessional) {
      _options.session = intern.SessionID;
    }

    intern.Register.set(key, _options);
  } catch (error) {
    return intern.ErrorHandler.error(error as Error);
  }
  
}