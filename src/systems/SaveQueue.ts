
import { _SIQ_Settings } from "../interfaces/Settings";
import { _SIQ_StoreOrder } from "../interfaces/StoreOrder";
import { _SIQ_ErrorHandler } from "./ErrorHandler";

import { _SIQ_Queue } from "./Queue";

export class _SIQ_SaveQueue {
  private errOut: _SIQ_ErrorHandler;
  private settings: _SIQ_Settings;
  private queue: _SIQ_Queue<_SIQ_StoreOrder>;

  private blocked = true;
  private enabled = false;

  private task: Function | null = null;

  constructor(settings: _SIQ_Settings, errorHandler: _SIQ_ErrorHandler) {
    this.errOut = errorHandler;
    this.settings = settings;
    this.queue = new _SIQ_Queue<_SIQ_StoreOrder>();

    this.init();
  }

  /**
   * Initialize the save queue
   */
  private init() {
    this.task = async () => this.processQueue();
    throw new Error('Method not implemented.');
  }

  /**
   * Process the save queue
   */
  private async processQueue() {
    if (this.blocked || !this.enabled) return;

    this.blocked = true;

    
  }

  /**
   * Start the save queue after it has been initialized
   */
  start() {
    throw new Error('Method not implemented.');
  }

}

export default _SIQ_SaveQueue;