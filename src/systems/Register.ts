import { _SIQ_RegisterData } from "../interfaces/RegisterData";
import { _SIQ_Settings } from "../interfaces/Settings";
import { _SIQ_ErrorHandler } from "./ErrorHandler";
import { _SIQ_IndexedDBController } from "./storage/indexedDB";

export class _SIQ_Register {
  private readonly register: Map<string, _SIQ_RegisterData>;
  private readonly indexedDB: _SIQ_IndexedDBController;

  private readonly settings: _SIQ_Settings;
  private readonly errorHandler: _SIQ_ErrorHandler;

  private changeCounter: number = 0;
  private lastSave: number = 0;

  constructor(settings: _SIQ_Settings, errorHandler: _SIQ_ErrorHandler) {
    this.register = new Map<string, _SIQ_RegisterData>();
    this.indexedDB = new _SIQ_IndexedDBController("register", "register");

    this.settings = settings;
    this.errorHandler = errorHandler;
  }

  public get(key: string): _SIQ_RegisterData | undefined {
    return this.register.get(key);
  }

  public set(key: string, data: _SIQ_RegisterData) {
    this.register.set(key, data);
    this.changeCounter++;
  }

  public delete(key: string) {
    this.register.delete(key);
    this.changeCounter++;
  }

  public clear() {
    this.register.clear();
    this.changeCounter++;
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
    if (this.settings.debug) {
      console.log("Loading register");
    }

    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    const data = await this.indexedDB.get("register");

    if (!data) {
      if (this.settings.debug) {
        console.log("No register found, using a fresh one");
      }
      return false;
    }

    this.register.clear();

    const map = new Map<string, _SIQ_RegisterData>(data);
    map.forEach((value, key) => {
      this.register.set(key, value);
    });

    if (this.settings.debug) {
      console.log("Register loaded: ", this.register);
    }

    return true;
  }

  /**
   * Save the register to the storage
   */
  public async saveRegister(): Promise<void> {
    if (this.lastSave === this.changeCounter) {
      return;
    }

    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    if (this.settings.debug) {
      console.log("Saving register");
    }

    // Save the current counter to prevent overseeing changes
    var currentCounter = this.changeCounter;

    await this.indexedDB.set("register", this.register);

    this.lastSave = currentCounter;

    if (this.settings.debug) {
      console.log("Register saved: ", this.register);
    }
  }

  /**
   * Clear the register from the storage
   */
  public async clearRegister(): Promise<void> {
    if (!this.indexedDB.isOpen()) {
      await this.indexedDB.openDB();
    }

    if (this.settings.debug) {
      console.log("Clearing register");
    }

    await this.indexedDB.delete("register");

    if (this.settings.debug) {
      console.log("Register cleared");
    }
  }

}
