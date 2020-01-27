const mongoose = require('mongoose');
const { ThirdPartyAccess } = require('../../../models/third-party-access');
const { thirdPartyAppAuth } = require('../../../middleware');

describe('thirdPartyAppAuth middleware', () => {
    let next,
        send,
        status,
        req,
        token;

    beforeEach(() => {
        const accessData = {
            _id: mongoose.Types.ObjectId().toHexString(),
            createdBy: mongoose.Types.ObjectId().toHexString(),
            appName: 'test'
        };
        token = new ThirdPartyAccess(accessData).generateAuthToken();
    });

    const exec = async () => {
        req = {
            header: jest.fn().mockReturnValue(token)
        };
        next = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        await thirdPartyAppAuth(req, res, next);
    }

    it('should return 401 if the token is not provided', async () => {
        token = '';

        await exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(401);
    });

    it('should return 400 if the token is not valid', async () => {
        token = 1;

        await exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(400);
    });
});
