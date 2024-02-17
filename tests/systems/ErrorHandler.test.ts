import { _SIQ_ErrorHandler } from '../../src/systems/ErrorHandler';

describe('_SIQ_ErrorHandler', () => {
  let errorHandler: _SIQ_ErrorHandler;
  let listener: (error: Error) => void;

  beforeEach(() => {
    errorHandler = new _SIQ_ErrorHandler();
    listener = jest.fn();
  });

  test('addListener fügt Listener hinzu', () => {
    errorHandler.addListener(listener);
    expect(errorHandler['listeners']).toContain(listener);
  });

  test('removeListener entfernt Listener', () => {
    errorHandler.addListener(listener);
    errorHandler.removeListener(listener);
    expect(errorHandler['listeners']).not.toContain(listener);
  });

  test('removeAllListener entfernt alle Listener', () => {
    errorHandler.addListener(listener);
    errorHandler.removeAllListener();
    expect(errorHandler['listeners']).toEqual([]);
  });

  test('error ruft alle Listener mit dem gegebenen Fehler auf', () => {
    const error = new Error('Test error');
    errorHandler.addListener(listener);
    errorHandler.error(error);
    expect(listener).toHaveBeenCalledWith(error);
  });
});