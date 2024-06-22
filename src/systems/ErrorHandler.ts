export class _SIQ_ErrorHandler {
  private listeners: Array<(error: Error) => void> = [];

  public addListener(listener: (error: Error) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (error: Error) => void): void {
    this.listeners = this.listeners.filter(h => h !== listener);
  }

  public removeAllListener(): void {
    this.listeners = [];
  }

  public error(error: Error): void {
    this.listeners.forEach(listener => listener(error as Error));
  }
}