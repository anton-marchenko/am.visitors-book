const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { ThirdPartyAccess } = require('../../../models/third-party-access');
const { thirdPartyAppAuth } = require('../../../middleware');

let server;

const mockUserData = () => ({
    name: {
        first: 'test',
        patronymic: 'test',
        last: 'test'
    },
    login: 'test',
    cardId: '12345',
    password: '12345'
});

const mockAccessData = () => ({
    createdBy: mongoose.Types.ObjectId().toHexString(),
    appName: 'test'
});

describe('thirdPartyAppAuth middleware - integration', () => {
    let user,
        access,
        next,
        send,
        status,
        req,
        token;

    beforeEach(async () => {
        server = require('../../../index');

        user = new User(mockUserData());
        await user.save();

        access = new ThirdPartyAccess(mockAccessData());
        await access.save();

        token = access.generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
        await ThirdPartyAccess.deleteMany({});
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

    it('should call next() if token is valid', async () => {
        await exec();

        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if permission denied', async () => {
        await access.delete();

        await exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status).toBeCalledWith(403);
    });
});