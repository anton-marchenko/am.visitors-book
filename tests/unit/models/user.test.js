const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user model', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
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

    it('should return fullname', () => {
        const name = {
            first: 'First',
            patronymic: 'Patronymic',
            last: 'Last'
        };
        const user = new User({ name });

        expect(user.fullName).toMatch(name.first);
        expect(user.fullName).toMatch(name.patronymic);
        expect(user.fullName).toMatch(name.last);
    });
});