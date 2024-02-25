import { _SIQ_RegisterData } from "../interfaces/RegisterData";
import { _SIQ_IndexedDBController } from "./storage/indexedDB";

export class _SIQ_Register {
  private readonly register: Map<string, _SIQ_RegisterData>;
  private readonly indexedDB: _SIQ_IndexedDBController;

  constructor() {
    this.register = new Map<string, _SIQ_RegisterData>();
    this.indexedDB = new _SIQ_IndexedDBController("register", "register");
  }

  public get(key: string): _SIQ_RegisterData | undefined {
    return this.register.get(key);
  }

  public set(key: string, data: _SIQ_RegisterData) {
    this.register.set(key, data);
  }

  public delete(key: string) {
    this.register.delete(key);
  }

  public clear() {
    this.register.clear();
  }

  public has(key: string): boolean {
    return this.register.has(key);
  }

  public keys(): IterableIterator<string> {
    return this.register.keys();
  }

  public values(): IterableIterator<_SIQ_RegisterData> {
    return this.register.values();
  }

  public entries(): IterableIterator<[string, _SIQ_RegisterData]> {
    return this.register.entries();
  }

  /**
   * Load the register from the storage if it exists, otherwise create a new one
   */
  public async loadRegister(): Promise<boolean> {
    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    const data = await this.indexedDB.get("register");

    if (!data) {
      return false;
    }

    this.register.clear();

    const map = new Map<string, _SIQ_RegisterData>(data);
    map.forEach((value, key) => {
      this.register.set(key, value);
    });

    return true;
  }

  /**
   * Save the register to the storage
   */
  public async saveRegister(): Promise<void> {
    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    const data = Array.from(this.register.entries());
    await this.indexedDB.set("register", data);
  }

  /**
   * Clear the register from the storage
   */
  public async clearRegister(): Promise<void> {
    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    await this.indexedDB.delete("register");
  }

}
