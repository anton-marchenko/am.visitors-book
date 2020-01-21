const { User } = require('../../../models/user');

let server;

describe('user model - createNewUser()', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    it('should save the user', async () => {
        const userData = {
            name: {
                first: 'test',
                patronymic: 'test',
                last: 'test'
            },
            login: 'test',
            password: 'test'
        };

        await User.createNewUser(userData);
        const user = await User.findOne({ login: userData.login });

        expect(user).not.toBeNull();
    });

    it('should return new user', async () => {
        const userData = {
            name: {
                first: 'test',
                patronymic: 'test',
                last: 'test'
            },
            login: 'test',
            password: 'test'
        };

        const user = await User.createNewUser(userData);

        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('login', userData.login);
    });
});
