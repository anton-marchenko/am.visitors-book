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

        const exec = async () => {
            return await request(server)
                .get('/api/users');
        }

        it.todo('should return 401 if client is not logged in');
        it.todo('should return 403 if user is not admin');

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
});
