export class _SIQ_IndexedDBController {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private storeName: string;

  public constructor(dbName: string, storeName: string) {
    this.storeName = storeName;
    this.dbName = "SIQ_" + dbName;
  }

  public async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async set(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(data, key);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async keys(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();
        request.onsuccess = () => {
          resolve(request.result as string[]);
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async values(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async entries(): Promise<[string, any][]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(request.error);
        };
      } else {
        reject("Database not open");
      }
    });
  }

  public async openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
      }
      const request = indexedDB.open(this.dbName);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = () => {
        this.db = request.result;
        this.db.createObjectStore(this.storeName);
      };
    });
  }

  public async closeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close();
        this.db = null;
        resolve();
      } else {
        reject("Database not open");
      }
    });
  }

  public async deleteDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public isOpen(): boolean {
    return this.db !== null;
  }
}