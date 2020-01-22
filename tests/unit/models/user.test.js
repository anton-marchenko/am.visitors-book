const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {
    User,
    createdUserValidator,
    baseValidator
} = require('../../../models/user');

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

describe('user model validation', () => {
    const genString = (length) => new Array(length + 1).join('a');
    let user;

    beforeEach(() => {
        user = {
            name: {
                first: 'test',
                patronymic: 'test',
                last: 'test'
            },
            login: 'test'
        };
    });

    describe('baseValidator', () => {
        it('should return no error if there is a valid input', () => {
            const { error } = baseValidator().validate(user);

            expect(error).toBeFalsy();
        });

        it('should return an error if name.first is less than 2 characters', () => {
            user.name.first = 'a';

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if name.first is more than 50 characters', () => {
            user.name.first = genString(51);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if name.patronymic is less than 2 characters', () => {
            user.name.patronymic = 'a';

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if name.patronymic is more than 50 characters', () => {
            user.name.patronymic = genString(51);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if name.last is less than 2 characters', () => {
            user.name.last = 'a';

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if name.last is more than 50 characters', () => {
            user.name.last = genString(51);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });


        it('should return an error if login is less than 3 characters', () => {
            user.login = genString(2);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if login is more than 50 characters', () => {
            user.login = genString(51);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if phone is more than 50 characters', () => {
            user.phone = genString(51);

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if there is an unexpected field in the user object', () => {
            user.mockUnexpectedField = 'test';

            const { error } = baseValidator().validate(user);

            expect(error).toBeTruthy();
        });
    });

    describe('createdUserValidator', () => {
        it('should return no error if it is valid input', () => {
            user.password = '12345';

            const { error } = createdUserValidator(user);

            expect(error).toBeFalsy();
        });

        it('should return an error if password is not exist', () => {
            user.password = undefined;

            const { error } = createdUserValidator(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if password is less than 3 characters', () => {
            user.password = '12';

            const { error } = createdUserValidator(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if password is more than 50 characters', () => {
            user.password = genString(51);

            const { error } = createdUserValidator(user);

            expect(error).toBeTruthy();
        });
    });

});
