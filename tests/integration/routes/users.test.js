const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

let server;

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

        it('should return 403 if permission denied', async () => {
            token = new User({ roles: [] }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return all users', async () => {
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
        it.todo('should return a user if valid id passed');
        it.todo('should return 404 if invalid id is passed');
        it.todo('should return 404 if no user is exist with the given id');
    });

    describe('POST /', () => {
        it.todo('should return 401 if client is not logged in');

        it.todo('should return 400 if name.first is less than 2 characters');
        it.todo('should return 400 if name.first is more than 50 characters');

        it.todo('should return 400 if name.patronymic is less than 2 characters');
        it.todo('should return 400 if name.patronymic is more than 50 characters');

        it.todo('should return 400 if name.last is less than 2 characters');
        it.todo('should return 400 if name.last is more than 50 characters');
    });
});
