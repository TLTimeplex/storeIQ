export class _SIQ_Queue<T> {

  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Add an item to the queue
   * @param item The item to add to the queue
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Get the first item in the queue
   * @returns The first item in the queue
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Clear all items from the queue
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Get a copy of all items in the queue
   * @returns The items in the queue
   */
  getAll(): T[] {
    return [...this.items];
  }

  /**
   * Get the number of items in the queue
   * @returns The number of items in the queue
   */
  length(): number {
    return this.items.length;
  }

  /**
   * Check if the queue is empty
   * @returns Whether the queue is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}