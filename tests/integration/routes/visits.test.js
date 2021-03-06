const request = require('supertest');
const mongoose = require('mongoose');
const { Visit } = require('../../../models/visit');
const { User } = require('../../../models/user');
const { ThirdPartyAccess } = require('../../../models/third-party-access');

const mockUserData = () => ({
    name: {
        first: 'test',
        patronymic: 'test',
        last: 'test'
    },
    login: 'test',
    cardId: '12345',
    password: '12345'
});

const mockAccessData = () => ({
    createdBy: mongoose.Types.ObjectId().toHexString(),
    appName: 'test'
});

describe('/api/visits', () => {
    describe('POST /', () => {
        let server,
            token,
            user,
            access,
            cardId;

        const exec = () => {
            return request(server)
                .post('/api/visits')
                .set('x-auth-token', token)
                .send({ cardId });
        };

        beforeEach(async () => {
            server = require('../../../index');

            const userData = mockUserData();
            cardId = userData.cardId;

            user = new User(userData);
            await user.save();

            access = new ThirdPartyAccess(mockAccessData());
            await access.save();

            token = access.generateAuthToken();
        });

        afterEach(async () => {
            await server.close();
            await Visit.deleteMany({});
            await User.deleteMany({});
        });

        it('should return 201 if new visit has been successfully created', async () => {
            const res = await exec();

            expect(res.status).toBe(201);
        });

        it('should return new visit if input is valid', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'userId'])
            );
        });

        it('should return 400 if the token is not valid', async () => {
            token = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if permission denied', async () => {
            await access.delete();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if an user has not been found for given card ID', async () => {
            await user.delete();

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('GET /', () => {
        let server,
            token,
            userIds;

        const exec = () => {
            return request(server)
                .get('/api/visits')
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            server = require('../../../index');

            token = new User({ roles: ['admin'] }).generateAuthToken();
            userIds = [
                mongoose.Types.ObjectId(),
                mongoose.Types.ObjectId()
            ];

            await Visit.collection.insertMany([
                { userId: userIds[0] },
                { userId: userIds[1] }
            ]);
        });

        afterEach(async () => {
            await server.close();
            await Visit.deleteMany({});
        });

        it('should return all visits', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(item => item.userId === userIds[0].toHexString())).toBeTruthy();
            expect(res.body.some(item => item.userId === userIds[1].toHexString())).toBeTruthy();
        });

        it('should return 400 if the token is not valid', async () => {
            token = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if permission denied', async () => {
            token = new User({ roles: [] }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
    });
});