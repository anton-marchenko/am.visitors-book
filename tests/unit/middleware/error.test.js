const { error } = require('../../../middleware');

describe('error middleware', () => {
    it('should return code 500', () => {
        const err = { message: '' };
        const req = jest.fn();
        const send = jest.fn();
        const status = jest.fn().mockReturnValue({ send });
        const res = { status };

        error(err, req, res);

        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(500);
    });
});