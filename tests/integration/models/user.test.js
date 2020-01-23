const mongoose = require('mongoose');
const { User } = require('../../../models/user');

let server;

const mockUserData = () => ({
    name: {
        first: 'test',
        patronymic: 'test',
        last: 'test'
    },
    login: 'test',
    password: '12345'
});

describe('user model create / update', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    describe('createNewUser()', () => {
        it('should save the user', async () => {
            const userData = mockUserData();

            await User.createNewUser(userData);
            const user = await User.findOne({ login: userData.login });

            expect(user).not.toBeNull();
        });

        it('should return new user', async () => {
            const userData = mockUserData();

            const user = await User.createNewUser(userData);

            expect(user).toHaveProperty('_id');
            expect(user).toHaveProperty('login', userData.login);
        });
    });

    describe('updateUser()', () => {
        let id,
            userData,
            editedUserData;

        beforeEach(async () => {
            userData = mockUserData();
            userData.phone = 'test';
            const user = new User(userData);

            await user.save();

            id = user._id;

            editedUserData = {
                name: {
                    first: 'edited',
                    patronymic: 'edited',
                    last: 'edited'
                },
                password: 'edited',
                login: 'edited'
            };
        });

        it('should update the user', async () => {
            await User.updateUser(id, editedUserData);

            const updatedUser = await User.findById(id);

            expect(updatedUser.login).toBe(editedUserData.login);
            expect(updatedUser.name).toMatchObject(editedUserData.name);
        });

        it('should return an updated user object if it is successful updating', async () => {
            const updatedUser = await User.updateUser(id, editedUserData);

            expect(updatedUser).toHaveProperty('login', editedUserData.login);
            expect(updatedUser.name).toMatchObject(editedUserData.name);
        });

        it('should return null if the user is not exist', async () => {
            id = mongoose.Types.ObjectId();

            const user = await User.updateUser(id, editedUserData);

            expect(user).toBeFalsy();
        });

        it('should not change a password if it is not defined in input data', async () => {
            editedUserData = {
                name: {
                    first: 'edited',
                    patronymic: 'edited',
                    last: 'edited'
                },
                login: 'edited',
                password: undefined
            };

            await User.updateUser(id, editedUserData);

            const updatedUser = await User.findById(id);

            expect(updatedUser).toHaveProperty('password', userData.password);
        });

        it('should not save a plain password if it is defined in input data', async () => {
            await User.updateUser(id, editedUserData);

            const updatedUser = await User.findById(id);

            expect(updatedUser).toHaveProperty('password');
            expect(updatedUser.password).not.toBe(userData.password);
            expect(updatedUser.password).not.toBe(editedUserData.password);
        });

        it('should not change a phone if it is not defined in input data', async () => {
            editedUserData.phone = undefined;

            await User.updateUser(id, editedUserData);

            const updatedUser = await User.findById(id);

            expect(updatedUser).toHaveProperty('phone');
            expect(updatedUser.phone).toBe(userData.phone);
        });

        it('should change a phone if it is defined in input data', async () => {
            editedUserData.phone = 'edited';

            await User.updateUser(id, editedUserData);

            const updatedUser = await User.findById(id);

            expect(updatedUser).toHaveProperty('phone');
            expect(updatedUser.phone).toBe(editedUserData.phone);
        });
    });
});
