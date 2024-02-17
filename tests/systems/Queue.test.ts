import { _SIQ_Queue } from "../../src/systems/Queue";

describe('SIQQueue', () => {
  let queue: _SIQ_Queue<number>;

  beforeEach(() => {
    queue = new _SIQ_Queue<number>();
  });

  test('enqueue adds items to the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue['items']).toEqual([1, 2]);
  });

  test('dequeue removes and returns the first item from the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    const item = queue.dequeue();
    expect(item).toBe(1);
    expect(queue['items']).toEqual([2]);
  });

  test('dequeue returns undefined if the queue is empty', () => {
    const item = queue.dequeue();
    expect(item).toBeUndefined();
  });

  test('clear removes all items from the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    expect(queue['items']).toEqual([]);
  });
});