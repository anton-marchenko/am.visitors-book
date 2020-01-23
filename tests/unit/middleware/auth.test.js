const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { auth } = require('../../../middleware');

describe('auth middleware', () => {
    let next,
        send,
        status,
        req,
        user,
        token;

    beforeEach(() => {
        user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            roles: [
                'role1',
                'role2'
            ]
        };
        token = new User(user).generateAuthToken();
    });

    const exec = () => {
        req = {
            header: jest.fn().mockReturnValue(token)
        };
        next = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ send });
        const res = { status };

        auth(req, res, next);
    }

    it('should populate req.user with the payload of a valid JWT', () => {
        exec();

        expect(req).toHaveProperty('user');
        expect(req.user).toMatchObject(user);
    });

    it('should return 401 if the token is not provided', () => {
        token = '';

        exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status.mock.calls[0][0]).toBe(401);
    });

    it('should return 400 if the token is not valid', () => {
        token = 'test';

        exec();

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalled();
        expect(send).toHaveBeenCalled();
        expect(status.mock.calls[0][0]).toBe(400);
    });
});