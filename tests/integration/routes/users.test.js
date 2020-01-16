const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

let server;
const generateString = (length) => new Array(length + 1).join('a');

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
        }

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
            // TODO: need actual user model
            const users = [
                { name: 'user1' },
                { name: 'user2' }
            ];

            await User.collection.insertMany(users);

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(user => user.name === 'user1')).toBeTruthy();
            expect(res.body.some(user => user.name === 'user2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        let token,
            id;

        const exec = async () => {
            return await request(server)
                .get('/api/users/' + id)
                .set('x-auth-token', token);
        }

        it('should return a user if valid id passed', async () => {
            const user = new User({
                name: {
                    first: 'test',
                    patronymic: 'test',
                    last: 'test'
                },
                password: '12345'
            });
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
            name,
            password;

        const exec = async () => {
            return await request(server)
                .post('/api/users/')
                .set('x-auth-token', token)
                .send({ name, password });
        }

        beforeEach(async () => {
            name = {
                first: 'test',
                patronymic: 'test',
                last: 'test'
            };
            password = '12345';

            const user = new User({ name, password });
            token = user.generateAuthToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if name.first is less than 2 characters', async () => {
            name.first = generateString(1);

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if name.first is more than 50 characters', async () => {
            name.first = generateString(51);

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it.todo('should return 400 if name.patronymic is less than 2 characters');
        it.todo('should return 400 if name.patronymic is more than 50 characters');

        it.todo('should return 400 if name.last is less than 2 characters');
        it.todo('should return 400 if name.last is more than 50 characters');
    });
});
