const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

describe('user model', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            roles: [
                'role1',
                'role2'
            ]
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        expect(decoded).toMatchObject(payload);
    });
});

describe('user model public data', () => {
    it('should contain public data', () => {
        const publicData = {
            login: 'test',
            phone: 'test',
        };
        const user = new User(publicData);

        expect(User.getPublicData(user)).toHaveProperty('login');
        expect(User.getPublicData(user)).toHaveProperty('phone');
    });

    it('should not contain any data except public data', () => {
        const notPublicData = {
            password: 'test'
        };
        const user = new User(notPublicData);

        expect(User.getPublicData(user)).not.toHaveProperty('password');
    });

    it('should contain public data keys', () => {
        data = User.publicFields();

        expect(data).toContain('_id');
        expect(data).toContain('login');
        expect(data).toContain('phone');
    });

    it('should not contain any keys except public data keys', () => {
        data = User.publicFields();

        expect(data).not.toContain('password');
    });
});
