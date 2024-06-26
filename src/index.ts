import { _SIQ_EntryChangeEvent } from './interfaces/EntryChangeEvent';
import { _SIQ_EntryMeta } from './interfaces/EntryMeta';
import { _SIQ_EntryOptions } from './interfaces/EntryOptions';
import { _SIQ_Intern } from './interfaces/Intern';
import { _SIQ_Public_Settings, _SIQ_Settings, _SIQ_mergeSettings } from './interfaces/Settings';

import { _SIQ_defaultSettings } from './config/defaultSettings';


import { _SIQ_ErrorHandler } from './systems/ErrorHandler';
import { _SIQ_AsyncStorageQueue } from './systems/AsyncStorageQueue';
import { _SIQ_Register } from './systems/Register';
import { _SIQ_IndexedDBController } from './systems/storage/indexedDB';

import { _SIQ_setItem } from './functions/setItem';
import { _SIQ_getItem } from './functions/getItem';
import { _SIQ_removeItem } from './functions/removeItem';
import { _SIQ_delete } from './functions/delete';
import { _SIQ_sanityCheck_EntryOptions } from './functions/sanityCheck/sanityCheck_EntryOptions';
import { _SIQ_setOptions } from './functions/setOptions';
import { _SIQ_generateSessionID } from './functions/generateSessionID';

class SIQ {
  private readonly instanceData: _SIQ_Intern;

  constructor(settings?: _SIQ_Public_Settings) {
    const MemoryMap: Map<string, any> = new Map<string, any>();
    const sessionID: number = _SIQ_generateSessionID();

    const Settings: _SIQ_Settings = _SIQ_mergeSettings(settings || {} as _SIQ_Public_Settings, _SIQ_defaultSettings);
    const ErrorHandler: _SIQ_ErrorHandler = new _SIQ_ErrorHandler();
    const IndexDBStorage
      : _SIQ_IndexedDBController = new _SIQ_IndexedDBController('storage', 'storage');

    const Register: _SIQ_Register = new _SIQ_Register(Settings, ErrorHandler);
    const Queue: _SIQ_AsyncStorageQueue = new _SIQ_AsyncStorageQueue(Settings, ErrorHandler, IndexDBStorage);

    this.instanceData = {
      MemoryMap: MemoryMap,
      Settings: Settings,
      Register: Register,
      Queue: Queue,
      ErrorHandler: ErrorHandler,
      SessionID: sessionID,
      IndexDBStorage: IndexDBStorage
    };
  }

  /**
   * Start the storage instance
   */
  public async start(): Promise<void> {
    var promises = [];
    promises.push(this.instanceData.IndexDBStorage.openDB());
    promises.push(this.instanceData.Queue.start());

    const rlr = this.instanceData.Register.loadRegister()
    promises.push(rlr);
    rlr.then(() => { this.instanceData.Register.autoSaveRegister(); });

    promises.push(this.instanceData.Queue.init()); // Remove ??
    await Promise.all(promises);
  }

  /**
   * Save an item to the storage
   * @param key The key to save the item under
   * @param value The value to save
   * @param options Optional settings for the entry
   * @returns A promise that resolves when the item is saved // added to save queue
   */
  public async setItem(key: string, value: any, options?: _SIQ_EntryOptions): Promise<void> {
    return _SIQ_setItem(this.instanceData, key, value, options);
  }

  /**
   * Retrieve an item from the storage
   * @param key The key to retrieve the item from
   * @returns A promise that resolves with the item
   */
  public async getItem(key: string): Promise<any> {
    return _SIQ_getItem(this.instanceData, key);
  }

  /**
   * Remove an item from the storage
   * @param key The key to remove the item from
   * @returns A promise that resolves when the item is removed
   */
  public async removeItem(key: string): Promise<void> {
    return _SIQ_removeItem(this.instanceData, key);
  }

  /**
   * Clear all items from the storage managed by this instance
   * @returns A promise that resolves when the storage is cleared
   */
  public async delete(): Promise<void> {
    return _SIQ_delete(this.instanceData);
  }

  /**
   * Clear all temporary items from the storage managed by this instance
   * @returns A promise that resolves when the storage is cleared
   */
  public clear(): void {
    this.instanceData.MemoryMap.clear();
  }

  /**
   * Get the metadata for an item
   * @param key The key to get the metadata for
   * @returns A promise that resolves with the metadata
   */
  public async getMeta(key: string): Promise<_SIQ_EntryMeta> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Get the amount of items in the storage
   * @returns A promise that resolves with the amount of items in the storage	
   */
  public async getLength(): Promise<number> {
    return this.instanceData.Register.size();
  }

  /**
   * Get the keys of all items in the storage
   * @returns A promise that resolves with the keys of all items in the storage
   */
  public async Keys(): Promise<string[]> {
    return Array.from(this.instanceData.Register.keys());
  }

  /**
   * Check if an item exists in the storage
   * @param key The key to check for
   * @returns A promise that resolves with a boolean indicating if the item exists
   */
  public async hasItem(key: string): Promise<boolean> {
    return this.instanceData.Register.has(key);
  }

  /**
   * Get the options for an item
   * @param key The key to get the options for
   * @returns A promise that resolves with the options
   */
  public setOptions(key: string, options: _SIQ_EntryOptions): void {
    _SIQ_setOptions(this.instanceData, key, options);
  }

  /**
   * Add an event listener for an item
   * @param key The key of the item to listen for changes on
   * @param callback The callback to call when the item changes
   */
  public on(key: string, callback: _SIQ_EntryChangeEvent): void {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Remove an event listener for an item
   * @param key The key of the item to stop listening for changes on
   * @param callback The callback to remove
   */
  public off(key: string, callback: _SIQ_EntryChangeEvent): void {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Remove all event listeners for an item
   * @param key The key of the item to stop listening for changes on
   */
  public offAll(key: string): void {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Adds an event Listener for internal errors
   * @param callback The callback to call when an error occurs
   */
  public onError(callback: (error: Error) => void): void {
    this.instanceData.ErrorHandler.addListener(callback);
  }

  /**
   * Removes an event Listener for internal errors
   * @param callback The callback to remove
   */
  public offError(callback: (error: Error) => void): void {
    this.instanceData.ErrorHandler.removeListener(callback);
  }

  /**
   * Removes all event Listeners for internal errors
   */
  public offAllErrors(): void {
    this.instanceData.ErrorHandler.removeAllListener();
  }

}

export default SIQ;