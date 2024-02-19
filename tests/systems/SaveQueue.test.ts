import { _SIQ_ErrorHandler } from "../../src/systems/ErrorHandler";
import { _SIQ_AsyncStorageQueue } from "../../src/systems/AsyncStorageQueue";


describe('SaveQueue', () => {
  let saveQueue: _SIQ_AsyncStorageQueue;
  let errorHandler: _SIQ_ErrorHandler;
  let errorListener: (error: Error) => void;

  beforeEach(() => {
    errorHandler = new _SIQ_ErrorHandler();
    errorListener = jest.fn().mockImplementation((error) => {
      throw error;
    });
    errorHandler.addListener(errorListener);

    saveQueue = new _SIQ_AsyncStorageQueue({
      debug: true,
      webStorageThreshold: 1000,
      shutter: {
        enabled: true,
        interval: 100,
        timeout: 150,
      },
    }, errorHandler);
  });

  test('processQueue start and stop the queue', async () => {
    saveQueue.start();

    await new Promise((resolve) => setTimeout(resolve, 500));

    await saveQueue.stop();

    expect(errorListener).not.toHaveBeenCalled();
    expect(saveQueue['running']).toBe(false);
    expect(saveQueue['enabled']).toBe(false);
    expect(saveQueue['task']).toBe(null);
    expect(saveQueue['blocked']).toBe(true);
  });
});