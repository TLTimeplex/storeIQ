import { _SIQ_EntryChangeEvent } from './interfaces/EntryChangeEvent';
import { _SIQ_EntryMeta } from './interfaces/EntryMeta';
import { _SIQ_EntryOptions } from './interfaces/EntryOptions';
import { _SIQ_Intern } from './interfaces/Intern';
import { _SIQ_Settings } from './interfaces/Settings';

import { _SIQ_defaultSettings } from './config/defaultSettings';

import { _SIQ_setItem } from './functions/setItem';

import { _SIQ_ErrorHandler } from './systems/ErrorHandler';
import { _SIQ_AsyncStorageQueue } from './systems/AsyncStorageQueue';

class SIQ {
  private readonly MemoryMap = new Map<string, any>();
  private readonly Settings: _SIQ_Settings;
  private readonly Queue: _SIQ_AsyncStorageQueue;
  private readonly ErrorHandler: _SIQ_ErrorHandler;

  private internSet: _SIQ_Intern;

  constructor(settings?: _SIQ_Settings) {
    this.Settings = settings || _SIQ_defaultSettings;
    this.ErrorHandler = new _SIQ_ErrorHandler();
    this.Queue = new _SIQ_AsyncStorageQueue(this.Settings, this.ErrorHandler);

    this.internSet = {
      MemoryMap: this.MemoryMap,
      Settings: this.Settings,
      Queue: this.Queue,
      ErrorHandler: this.ErrorHandler
    };

    this.Queue.start();
  }

  /**
   * Save an item to the storage
   * @param key The key to save the item under
   * @param value The value to save
   * @param options Optional settings for the entry
   * @returns A promise that resolves when the item is saved // added to save queue
   */
  public async setItem(key: string, value: any, options?: _SIQ_EntryOptions): Promise<void> {
    return _SIQ_setItem(this.internSet, key, value, options);
  }

  /**
   * Retrieve an item from the storage
   * @param key The key to retrieve the item from
   * @returns A promise that resolves with the item
   */
  public async getItem(key: string): Promise<any> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Remove an item from the storage
   * @param key The key to remove the item from
   * @returns A promise that resolves when the item is removed
   */
  public async removeItem(key: string): Promise<void> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Clear all items from the storage managed by this instance
   * @returns A promise that resolves when the storage is cleared
   */
  public async delete(): Promise<void> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Clear all temporary items from the storage managed by this instance
   * @returns A promise that resolves when the storage is cleared
   */
  public async clear(): Promise<void> {
    throw new Error('Not implemented'); // TODO: Impl
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
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Get the keys of all items in the storage
   * @returns A promise that resolves with the keys of all items in the storage
   */
  public async Keys(): Promise<string[]> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Check if an item exists in the storage
   * @param key The key to check for
   * @returns A promise that resolves with a boolean indicating if the item exists
   */
  public async hasItem(key: string): Promise<boolean> {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Get the options for an item
   * @param key The key to get the options for
   * @returns A promise that resolves with the options
   */
  public setOptions(key: string, options: _SIQ_EntryOptions): void {
    throw new Error('Not implemented'); // TODO: Impl
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
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Removes an event Listener for internal errors
   * @param callback The callback to remove
   */
  public offError(callback: (error: Error) => void): void {
    throw new Error('Not implemented'); // TODO: Impl
  }

  /**
   * Removes all event Listeners for internal errors
   */
  public offAllErrors(): void {
    throw new Error('Not implemented'); // TODO: Impl
  }

}

export default SIQ;