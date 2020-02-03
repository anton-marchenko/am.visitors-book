const bcrypt = require('bcrypt');
const {
    baseValidator,
    signInUserValidator,
    createdUserValidator,
    editedUserValidator,
    validatePassword
} = require('../../../models/user.utils');

/**
 * Non-string values that can be recived
 * from client as parsed JSON
 */
const mockNonStringValues = () => ([
    null,
    1,
    [],
    {}
]);

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

        const exec = () => {
            return baseValidator().validate(user);
        }

        it('should return no error if there is a valid input', () => {
            const { error } = exec();

            expect(error).toBeFalsy();
        });

        it('should return an error if name.first is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.name.first = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if name.first is less than 2 characters', () => {
            user.name.first = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if name.first is more than 50 characters', () => {
            user.name.first = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if name.patronymic is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.name.patronymic = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if name.patronymic is less than 2 characters', () => {
            user.name.patronymic = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if name.patronymic is more than 50 characters', () => {
            user.name.patronymic = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if name.last is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.name.last = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if name.last is less than 2 characters', () => {
            user.name.last = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if name.last is more than 50 characters', () => {
            user.name.last = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if login is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.login = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if login is less than 3 characters', () => {
            user.login = genString(2);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if login is more than 50 characters', () => {
            user.login = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if phone is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.phone = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if phone is more than 50 characters', () => {
            user.phone = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if cardId is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.cardId = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if cardId is more than 50 characters', () => {
            user.cardId = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if there is an unexpected field in the user object', () => {
            user.mockUnexpectedField = 'test';

            const { error } = exec();

            expect(error).toBeTruthy();
        });
    });

    describe('createdUserValidator', () => {

        const exec = () => {
            return createdUserValidator(user);
        };

        it('should return no error if it is valid input', () => {
            user.password = '12345';

            const { error } = exec();

            expect(error).toBeFalsy();
        });

        it('should return an error if password is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.password = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if password is not exist', () => {
            user.password = undefined;

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is less than 3 characters', () => {
            user.password = '12';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is more than 50 characters', () => {
            user.password = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });
    });

    describe('editedUserValidator', () => {

        const exec = () => {
            return editedUserValidator(user);
        }

        it('should return no error if it is valid input', () => {
            user.password = '12345';

            const { error } = exec();

            expect(error).toBeFalsy();
        });

        it('should return an error if password is not a string', () => {
            mockNonStringValues().forEach(value => {
                user.password = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return no error if input is valid but password is not defined', () => {
            user.password = undefined;

            const { error } = exec();

            expect(error).toBeFalsy();
        });

        it('should return an error if password is less than 3 characters', () => {
            user.password = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is more than 50 characters', () => {
            user.password = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });
    });

    describe('signInUserValidator', () => {
        let login, password;

        beforeEach(() => {
            login = 'test';
            password = '12345';
        });

        const exec = () => {
            return signInUserValidator({
                login,
                password
            });
        }

        it('should return no error if it is valid input', () => {
            const { error } = exec();

            expect(error).toBeFalsy();
        });

        it('should return an error if login is not exist', () => {
            login = undefined;

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if login is not a string', () => {
            mockNonStringValues().forEach(value => {
                login = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if login is less than 3 characters', () => {
            login = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if login is more than 50 characters', () => {
            login = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is not exist', () => {
            password = undefined;

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is not a string', () => {
            mockNonStringValues().forEach(value => {
                password = value;

                const { error } = exec();

                expect(error).toBeTruthy();
            });
        });

        it('should return an error if password is less than 3 characters', () => {
            password = 'a';

            const { error } = exec();

            expect(error).toBeTruthy();
        });

        it('should return an error if password is more than 50 characters', () => {
            password = genString(51);

            const { error } = exec();

            expect(error).toBeTruthy();
        });
    });

    describe('validatePassword', () => {
        let password;

        const exec = async () => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('12345', salt);

            return await validatePassword(password, hashedPassword);
        }

        it('should return true if password is valid', async () => {
            password = '12345';

            const res = await exec();

            expect(res).toBeTruthy();
        });

        it('should return false if password is not valid', async () => {
            password = '11111';

            const res = await exec();

            expect(res).toBeFalsy();
        });
    });
});
