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
        const res = {};
        const next = jest.fn();

        auth(req, res, next);
    }

    it('should populate req.user with the payload of a valid JWT', () => {
        exec();

        expect(req).toHaveProperty('user');
        expect(req.user).toMatchObject(user);
    });
});