const EventEmitter = require('events');
const logging = require('../../../startup/logging');

describe('startup - logging()', () => {
    it('should throw an error if there is an unhandled rejection inside the app', async () => {
        const mockProcess = new EventEmitter();

        logging(mockProcess);

        expect(() => mockProcess.emit('unhandledRejection')).toThrow();
    });
});