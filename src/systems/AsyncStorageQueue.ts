
import { _SIQ_Location } from "../enum/Location";
import { _SIQ_setLocalStorage } from "../functions/storage/localStorage";
import { _SIQ_setSessionStorage } from "../functions/storage/sessionStorage";
import { _SIQ_Settings } from "../interfaces/Settings";
import { _SIQ_StorageOrder } from "../interfaces/StorageOrder";
import { _SIQ_ErrorHandler } from "./ErrorHandler";

import { _SIQ_Queue } from "./Queue";
import { _SIQ_IndexedDBController } from "./storage/indexedDB";

export class _SIQ_AsyncStorageQueue {
  private errOut: _SIQ_ErrorHandler;
  private settings: _SIQ_Settings;
  private queue: _SIQ_Queue<_SIQ_StorageOrder>;

  private blocked = true;
  private enabled = false;
  private running = false;

  private task: Promise<void> | null = null;

  private indexedDB: _SIQ_IndexedDBController;

  constructor(settings: _SIQ_Settings, errorHandler: _SIQ_ErrorHandler, indexedDB: _SIQ_IndexedDBController) {
    this.errOut = errorHandler;
    this.settings = settings;
    this.indexedDB = indexedDB;
    this.queue = new _SIQ_Queue<_SIQ_StorageOrder>();
  }

  /**
   * Initialize the async queue
   */
  public async init(): Promise<void> {
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
          console.log(`Async Queue: start:${start}, end:${end}, next:${next}`);
        }

        this.process(end);

        await new Promise((resolve) => setTimeout(resolve, next - new Date().getTime()));
      }

      if (this.settings.debug) {
        console.log('Async Queue: Stopped by request.');
      }
    }
    catch (err) {
      this.errOut.error(err as Error);
      if (this.settings.debug) {
        console.log('Async Queue: Stopped by error.');
      }
    }
    finally {
      this.running = false;
    }
  }

  /**
   * Process the async queue
   * @param end The time at which the process should end
   */
  private async process(end: number) {
    if (this.blocked || !this.enabled) return;
    if (this.queue.isEmpty()) return;
    if (this.indexedDB === null) await this.init();
    if (!this.indexedDB?.isOpen()) return; // Could lead to issues?

    this.blocked = true;

    while (new Date().getTime() < end) {
      const order = this.queue.dequeue();

      if (order === undefined || order === null) break;

      switch (order?.location) {
        case _SIQ_Location.IndexedDB:
          await this.indexedDB.set(order.key, order.value);
          break;
        case _SIQ_Location.LocalStorage:
          _SIQ_setLocalStorage(order.key, order.value);
          break;
        case _SIQ_Location.SessionStorage:
          _SIQ_setSessionStorage(order.key, order.value);
          break;
        default:
          order.callback?.(false);
          this.errOut.error(new Error('Invalid location'));
          break;
      }

      order.callback?.(true);
    }

    this.blocked = false;

  }

  /**
   * Start the async queue after it has been initialized
   */
  public start() {
    if (this.running) return this.errOut.error(new Error('Async Queue is already running'));
    if (this.enabled) return this.errOut.error(new Error('Async Queue is already enabled'));
    if (this.task !== null) return this.errOut.error(new Error('Async Queue has already been initialized'));

    this.enabled = true;
    this.blocked = false;
    this.task = this.processQueue();
  }

  /**
   * Stop the async queue
   */
  public async stop() {
    if (!this.enabled) return this.errOut.error(new Error('Async Queue is not enabled'));
    if (this.task === null) return this.errOut.error(new Error('Async Queue has not been initialized'));

    this.enabled = false;
    await this.task;

    this.blocked = true;
    this.task = null;
  }

  public isRunning() {
    return this.running;
  }


  /**
   * Add a storage order to the queue
   * @param storageOrder The storage order to add to the queue
    */
  public addOrder(storageOrder: _SIQ_StorageOrder) {
    this.queue.enqueue(storageOrder);
  }

  public async clear() {
    const wasRunning = this.running;
    if (wasRunning) await this.stop();
    this.queue.clear();
    if (wasRunning) this.start();
  }

}

export default _SIQ_AsyncStorageQueue;