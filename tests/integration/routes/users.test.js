const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

let server;
const genString = (length) => new Array(length + 1).join('a');
const mockUserData = (cb) => {
    const data = {
        name: {
            first: 'test',
            patronymic: 'test',
            last: 'test'
        },
        password: '12345',
        login: 'test'
    };
    return cb ? cb(data) : data
};

describe('/api/users', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    describe('GET /', () => {

        let token;

        const exec = async () => {
            return await request(server)
                .get('/api/users')
                .set('x-auth-token', token);
        };

        beforeEach(() => {
            token = new User({ roles: ['admin'] }).generateAuthToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        // TODO: probably need make to unit tests for testing permissions
        it('should return 403 if permission denied', async () => {
            token = new User({ roles: [] }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return all users', async () => {
            const users = [
                mockUserData((user) => ({ ...user, login: user.login + '1' })),
                mockUserData((user) => ({ ...user, login: user.login + '2' })),
            ];

            await User.collection.insertMany(users);

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(user => user.login === users[0].login)).toBeTruthy();
            expect(res.body.some(user => user.login === users[1].login)).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        let token,
            id;

        const exec = async () => {
            return await request(server)
                .get('/api/users/' + id)
                .set('x-auth-token', token);
        };

        it('should return a user if valid id passed', async () => {
            const user = new User(mockUserData());
            await user.save();

            id = user._id;
            token = user.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name.first', user.name.first);
        });

        it('should return 404 if invalid id is passed', async () => {
            token = new User().generateAuthToken();
            id = '1';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if a user with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
            token = new User().generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token,
            login,
            name,
            password;

        const exec = async () => {
            return await request(server)
                .post('/api/users/')
                .set('x-auth-token', token)
                .send({ name, password, login });
        };

        const checkCode =
            code =>
                cb =>
                    async () => {
                        cb();

                        const res = await exec();

                        expect(res.status).toBe(code);
                    };

        const checkCode400 = checkCode(400);

        beforeEach(async () => {
            const userData = mockUserData();
            name = userData.name;
            login = userData.login;
            password = userData.password;

            const user = new User({ name, password, login });
            token = user.generateAuthToken();
        });

        it('should return 401 if client is not logged in',
            checkCode(401)(() => token = '')
        );

        it('should return 400 if name.first is less than 2 characters',
            checkCode400(() => name.first = 'a')
        );

        it('should return 400 if name.first is more than 50 characters',
            checkCode400(() => name.first = genString(51))
        );

        it('should return 400 if name.patronymic is less than 2 characters',
            checkCode400(() => name.patronymic = 'a')
        );

        it('should return 400 if name.patronymic is more than 50 characters',
            checkCode400(() => name.patronymic = genString(51))
        );

        it('should return 400 if name.last is less than 2 characters',
            checkCode400(() => name.last = 'a')
        );

        it('should return 400 if name.last is more than 50 characters',
            checkCode400(() => name.last = genString(51))
        );

        it('should return 400 if password is less than 3 characters',
            checkCode400(() => password = genString(2))
        );

        it('should return 400 if password is more than 50 characters',
            checkCode400(() => password = genString(51))
        );

        it('should return 400 if login is less than 3 characters',
            checkCode400(() => login = genString(2))
        );

        it('should return 400 if login is more than 50 characters',
            checkCode400(() => login = genString(51))
        );
    });
});
