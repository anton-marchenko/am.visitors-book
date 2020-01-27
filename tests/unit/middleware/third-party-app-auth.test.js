const mongoose = require('mongoose');
const { ThirdPartyAccess } = require('../../../models/third-party-access');
const { thirdPartyAppAuth } = require('../../../middleware');

describe('thirdPartyAppAuth middleware', () => {
    let next,
        send,
        status,
        req,
        user,
        token;

    beforeEach(() => {
        const accessData = {
            _id: mongoose.Types.ObjectId().toHexString(),
            createdBy: mongoose.Types.ObjectId().toHexString(),
            appName: 'test'
        };
        token = new ThirdPartyAccess(accessData).generateAuthToken();
    });

    const exec = () => {
        req = {
            header: jest.fn().mockReturnValue(token)
        };
        next = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        thirdPartyAppAuth(req, res, next);
    }

    it('should call next() if token is valid', () => {
        exec();

        expect(next).toHaveBeenCalled();
    });

    it.todo('should return 401 if the token is expired');

    it('should return 401 if the token is not provided', () => {
        token = '';

        exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(401);
    });

    it('should return 400 if the token is not valid', () => {
        token = 1;

        exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(400);
    });
});
