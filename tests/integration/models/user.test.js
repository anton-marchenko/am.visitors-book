const { User } = require('../../../models/user');

let server;

const mockUserData = () => ({
    name: {
        first: 'test',
        patronymic: 'test',
        last: 'test'
    },
    login: 'test',
    password: 'test'
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
        it.todo('should update the user');
        it.todo('should return null if the user is not found');
        it.todo('should return updated user if it is successful updating');
    });

});
