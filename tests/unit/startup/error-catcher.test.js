const EventEmitter = require('events');
const errorCatcher = require('../../../startup/error-catcher');

describe('startup - errorCatcher()', () => {
    it('should throw an error if there is an unhandled rejection inside the app', async () => {
        const mockProcess = new EventEmitter();

        errorCatcher(mockProcess);

        expect(() => mockProcess.emit('unhandledRejection')).toThrow();
    });
});