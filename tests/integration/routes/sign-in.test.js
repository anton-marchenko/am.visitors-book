const config = require('config');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');

let server;

const mockUserData = () => ({
    name: {
        first: 'test',
        patronymic: 'test',
        last: 'test'
    },
    password: '12345',
    login: 'test'
});

describe('/api/sign-in', () => {
    let login, password;

    beforeEach(async () => {
        server = require('../../../index');

        const userData = mockUserData();
        await User.createNewUser(userData);

        login = userData.login;
        password = userData.password;
    });

    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    const exec = async () => {
        return await request(server)
            .post('/api/sign-in')
            .send({
                login,
                password
            });
    };

    it('should return valid JWT', async () => {
        const res = await exec();
        
        expect(() => {
            jwt.verify(res.text, config.get('jwtSecret'))
        }).not.toThrow();
    });

    it('should return 200 if input is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should return 400 if input is not valid', async () => {
        login = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if an user was not found', async () => {
        login = 'test2';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if a password is not valid', async () => {
        password = '111111';

        const res = await exec();

        expect(res.status).toBe(400);
    });
});
