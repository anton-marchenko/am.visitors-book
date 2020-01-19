const { User, validator } = require('../../../models/user');
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

describe('user model validation', () => {
    let user;

    beforeEach(() => {
        user = {
            name: {
                first: 'First',
                patronymic: 'Patronymic',
                last: 'Last'
            },
            password: '12345',
            login: 'test'
        };
    });

    it('should return no error if there is a valid input', () => {
        const { error } = validator(user);

        expect(error).toBeFalsy();
    });

    it.todo('should return an error if name.first is less than 2 characters');
    it.todo('should return an error if name.first is more than 50 characters');
    it.todo('should return an error if name.patronymic is less than 2 characters');
    it.todo('should return an error if name.patronymic is more than 50 characters');
    it.todo('should return an error if name.last is less than 2 characters');
    it.todo('should return an error if name.last is more than 50 characters');
    it.todo('should return an error if password is less than 3 characters');
    it.todo('should return an error if password is more than 50 characters');
    it.todo('should return an error if login is less than 3 characters');
    it.todo('should return an error if login is more than 50 characters');
});