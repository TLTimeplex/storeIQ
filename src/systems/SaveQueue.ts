
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
  private running = false;

  private task: Promise<void> | null = null;

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
    // TODO: Initialize?
  }

  /**
   * Shutter control
   */
  public async processQueue() {
    try {
      this.running = true;
      while (this.enabled) {
        const start = new Date().getTime();
        const end = new Date().getTime() + this.settings.shutter.interval;
        const next = (end + this.settings.shutter.timeout);

        if (this.settings.debug) {
          console.log(`Save Queue: start:${start}, end:${end}, next:${next}`);
        }

        this.process(end);

        await new Promise((resolve) => setTimeout(resolve, next - new Date().getTime()));
      }

      if (this.settings.debug) {
        console.log('Save Queue: Stopped by request.');
      }
    }
    catch (err) {
      this.errOut.error(err as Error);
      if (this.settings.debug) {
        console.log('Save Queue: Stopped by error.');
      }
    }
    finally {
      this.running = false;
    }
  }

  /**
   * Process the save queue
   * @param end The time at which the process should end
   */
  private async process(end: number) {
    if (this.blocked || !this.enabled) return;
    if (this.queue.isEmpty()) return;

    this.blocked = true;

    while (new Date().getTime() < end) {
      const order = this.queue.dequeue();
      // TODO: Handle the order
    }

    this.blocked = false;

  }

  /**
   * Start the save queue after it has been initialized
   */
  public start() {
    if (this.running) return this.errOut.error(new Error('Save Queue is already running'));
    if (this.enabled) return this.errOut.error(new Error('Save Queue is already enabled'));
    if (this.task !== null) return this.errOut.error(new Error('Save Queue has already been initialized'));

    this.enabled = true;
    this.blocked = false;
    this.task = this.processQueue();
  }

  /**
   * Stop the save queue
   */
  public async stop() {
    if (!this.enabled) return this.errOut.error(new Error('Save Queue is not enabled'));
    if (this.task === null) return this.errOut.error(new Error('Save Queue has not been initialized'));

    this.enabled = false;
    await this.task;

    this.blocked = true;
    this.task = null;
  }

  public isRunning() {
    return this.running;
  }

}

export default _SIQ_SaveQueue;