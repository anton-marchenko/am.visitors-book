const mongoose = require('mongoose');
const { validateObjectId } = require('../../../middleware');

describe('validateObjectId middleware', () => {

    let id,
        status,
        send,
        next;

    const exec = () => {
        const req = {
            params: {
                id
            }
        };
        next = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        validateObjectId(req, res, next);
    }

    it('should return 404 if there is not a valid ObjectId in request', () => {
        id = '1'; 

        exec();

        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status.mock.calls[0][0]).toBe(404);
    });

    it('should call next if there is a valid id in request', () => {
        id = mongoose.Types.ObjectId().toHexString();

        exec();

        expect(next).toHaveBeenCalled();
    });
});