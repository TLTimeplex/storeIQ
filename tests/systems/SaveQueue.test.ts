import { _SIQ_ErrorHandler } from "../../src/systems/ErrorHandler";
import { _SIQ_SaveQueue } from "../../src/systems/SaveQueue";


describe('SaveQueue', () => {
  let saveQueue: _SIQ_SaveQueue;
  let errorHandler: _SIQ_ErrorHandler;
  let errorListener: (error: Error) => void;

  beforeEach(() => {
    errorHandler = new _SIQ_ErrorHandler();
    errorListener = jest.fn().mockImplementation((error) => {
      throw error;
    });
    errorHandler.addListener(errorListener);

    saveQueue = new _SIQ_SaveQueue({
      debug: true,
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