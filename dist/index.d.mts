type _SIQ_EntryChangeEvent = (...args: any[]) => boolean;

interface _SIQ_EntryMeta {
}

interface _SIQ_EntryOptions {
    /**
     * If the entry should be removed once the session is closed
     */
    sessional?: boolean;
    /**
     * Date at which the entry should expire and be removed
     */
    expires?: number;
}

interface _SIQ_Public_Settings {
    register?: {
        autoSaveInterval?: number;
    };
    /** Defines the maximum size of a string saved in the Webstorages */
    webStorageThreshold?: number;
    debug?: boolean;
    shutter?: {
        enabled?: boolean;
        interval?: number;
        timeout?: number;
    };
}

declare class SIQ {
    private readonly instanceData;
    constructor(settings?: _SIQ_Public_Settings);
    /**
     * Start the storage instance
     */
    start(): Promise<void>;
    /**
     * Save an item to the storage
     * @param key The key to save the item under
     * @param value The value to save
     * @param options Optional settings for the entry
     * @returns A promise that resolves when the item is saved // added to save queue
     */
    setItem(key: string, value: any, options?: _SIQ_EntryOptions): Promise<void>;
    /**
     * Retrieve an item from the storage
     * @param key The key to retrieve the item from
     * @returns A promise that resolves with the item
     */
    getItem(key: string): Promise<any>;
    /**
     * Remove an item from the storage
     * @param key The key to remove the item from
     * @returns A promise that resolves when the item is removed
     */
    removeItem(key: string): Promise<void>;
    /**
     * Clear all items from the storage managed by this instance
     * @returns A promise that resolves when the storage is cleared
     */
    delete(): Promise<void>;
    /**
     * Clear all temporary items from the storage managed by this instance
     * @returns A promise that resolves when the storage is cleared
     */
    clear(): void;
    /**
     * Get the metadata for an item
     * @param key The key to get the metadata for
     * @returns A promise that resolves with the metadata
     */
    getMeta(key: string): Promise<_SIQ_EntryMeta>;
    /**
     * Get the amount of items in the storage
     * @returns A promise that resolves with the amount of items in the storage
     */
    getLength(): Promise<number>;
    /**
     * Get the keys of all items in the storage
     * @returns A promise that resolves with the keys of all items in the storage
     */
    Keys(): Promise<string[]>;
    /**
     * Check if an item exists in the storage
     * @param key The key to check for
     * @returns A promise that resolves with a boolean indicating if the item exists
     */
    hasItem(key: string): Promise<boolean>;
    /**
     * Get the options for an item
     * @param key The key to get the options for
     * @returns A promise that resolves with the options
     */
    setOptions(key: string, options: _SIQ_EntryOptions): void;
    /**
     * Add an event listener for an item
     * @param key The key of the item to listen for changes on
     * @param callback The callback to call when the item changes
     */
    on(key: string, callback: _SIQ_EntryChangeEvent): void;
    /**
     * Remove an event listener for an item
     * @param key The key of the item to stop listening for changes on
     * @param callback The callback to remove
     */
    off(key: string, callback: _SIQ_EntryChangeEvent): void;
    /**
     * Remove all event listeners for an item
     * @param key The key of the item to stop listening for changes on
     */
    offAll(key: string): void;
    /**
     * Adds an event Listener for internal errors
     * @param callback The callback to call when an error occurs
     */
    onError(callback: (error: Error) => void): void;
    /**
     * Removes an event Listener for internal errors
     * @param callback The callback to remove
     */
    offError(callback: (error: Error) => void): void;
    /**
     * Removes all event Listeners for internal errors
     */
    offAllErrors(): void;
}

export { SIQ as default };
