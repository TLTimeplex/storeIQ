export interface _SIQ_EntryOptions {
  /**
   * If the entry should be removed once the session is closed
   */
  sessional?: boolean;
  /**
   * Date at which the entry should expire and be removed
   */
  expires?: number; 
  // TODO:
}