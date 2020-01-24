const { validate } = require('../../../middleware');

describe('validate middleware', () => {
    let validatorReturn,
        validator,
        status,
        send,
        next;
    const reqBody = 'test';

    const exec = () => {
        validator = jest.fn().mockReturnValue(validatorReturn);
        const req = {
            body: reqBody
        };
        next = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        validate(validator)(req, res, next);
    }

    it('should return 400 if there is an invalid input', () => {
        validatorReturn = {
            error: {
                details: [{ message: 'error' }]
            }
        };

        exec();

        expect(validator).toHaveBeenCalled();
        expect(validator).toBeCalledWith(reqBody);
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(400);
    });

    it('should call next() if there is a valid input', () => {
        validatorReturn = {
            error: undefined
        };

        exec();

        expect(validator).toHaveBeenCalled();
        expect(validator).toBeCalledWith(reqBody);
        expect(next).toHaveBeenCalled();
    });
});