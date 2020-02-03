const {
    createdUserValidator,
    editedUserValidator
} = require('../../../models/user');
const { baseValidator } = require('../../../models/user.utils');

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

        it('should return an error if cardId is more than 50 characters', () => {
            user.cardId = genString(51);

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

    describe('editedUserValidator', () => {
        it('should return no error if it is valid input', () => {
            user.password = '12345';

            const { error } = editedUserValidator(user);

            expect(error).toBeFalsy();
        });

        it('should return no error if input is valid but password is not defined', () => {
            user.password = undefined;

            const { error } = editedUserValidator(user);

            expect(error).toBeFalsy();
        });

        it('should return an error if password is less than 3 characters', () => {
            user.password = 'a';

            const { error } = editedUserValidator(user);

            expect(error).toBeTruthy();
        });

        it('should return an error if password is more than 50 characters', () => {
            user.password = genString(51);

            const { error } = editedUserValidator(user);

            expect(error).toBeTruthy();
        });
    });

    describe('signInUserValidator', () => {
        it.todo('should return no error if it is valid input');
        it.todo('should return an error if login is not exist');
        it.todo('should return an error if login is not a string');
        it.todo('should return an error if login is less than 3 characters');
        it.todo('should return an error if login is more than 50 characters');
        it.todo('should return an error if password is not exist');
        it.todo('should return an error if password is not a string');
        it.todo('should return an error if password is less than 3 characters');
        it.todo('should return an error if password is more than 50 characters');
    });
});
