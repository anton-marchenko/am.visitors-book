const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

let server;

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
            userData;

        const exec = async () => {
            const { name, password, login } = userData;
            return await request(server)
                .post('/api/users/')
                .set('x-auth-token', token)
                .send({ name, password, login });
        };

        beforeEach(async () => {
            userData = mockUserData();

            const user = new User({ roles: ['admin'] })
            token = user.generateAuthToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if permission denied', async () => {
            const user = new User({ roles: [] })
            token = user.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 400 if input is not valid', async () => {
            userData.login = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 201 if the user successfully created', async () => {
            const res = await exec();

            expect(res.status).toBe(201);
        });

        it('should return the user if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('login', userData.login);
        });
    });

    describe('PUT /:id', () => {
        let token,
            id;

        const exec = async () => {
            return await request(server)
                .put('/api/users/' + id)
                .set('x-auth-token', token)
                .send({ });
        };

        beforeEach(async () => {
            const user = new User(mockUserData());
            await user.save();

            const admin = new User({ roles: ['admin'] })
            token = admin.generateAuthToken();
            id = user._id;
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it.todo('should return 404 if an user with given id was not found');
        it.todo('should return 404 if id is invalid');
        it.todo('should return 403 if permission denied');
        it.todo('should return 400 if login is not valid');

        it.todo('should  update the user if input is valid');
        it.todo('should return the updated user if input is valid');
    });
});
