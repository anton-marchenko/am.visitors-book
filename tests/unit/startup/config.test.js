const config = require('../../../startup/config');

describe('startup - config', () => {
    it('should throw an error if jwtSecret is not provided', () => {
        const get = jest.fn().mockReturnValue('');
        const mockConfig = {
            get
        }

        expect(() => config(mockConfig)).toThrow();
    });
});