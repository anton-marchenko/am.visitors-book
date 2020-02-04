const mongoose = require('mongoose');
const request = require('supertest');
const config = require('config');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');
const { ThirdPartyAccess } = require('../../../models/third-party-access');

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

describe('/api/access/third-party-app/tokens', () => {
    describe('GET /', () => {
        let token;

        beforeEach(async () => {
            server = require('../../../index');

            token = new User({ roles: ['admin'] }).generateAuthToken();
        });

        afterEach(async () => {
            await server.close();
            await ThirdPartyAccess.deleteMany({});
        });

        const exec = async () => {
            return await request(server)
                .get('/api/access/third-party-app/tokens')
                .set('x-auth-token', token);
        };

        it('should return all access entries', async () => {
            await ThirdPartyAccess.createNewAccess({
                createdBy: mongoose.Types.ObjectId(),
                appName: 'test1'
            });

            await ThirdPartyAccess.createNewAccess({
                createdBy: mongoose.Types.ObjectId(),
                appName: 'test2'
            });

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(item => item.appName === 'test1')).toBeTruthy();
            expect(res.body.some(item => item.appName === 'test1')).toBeTruthy();
        });

        it('should return 400 if clients token is not valid', async () => {
            token = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if a client is not logged in', async () => {
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

    describe('POST /', () => {
        let token, userId, appName;

        beforeEach(async () => {
            server = require('../../../index');

            const user = new User({
                ...mockUserData(),
                roles: ['admin']
            });

            await user.save();

            userId = user._id;
            token = user.generateAuthToken();
            appName = 'test';
        });

        afterEach(async () => {
            await server.close();
            await User.deleteMany({});
            await ThirdPartyAccess.deleteMany({});
        });

        const exec = async () => {
            return await request(server)
                .post('/api/access/third-party-app/tokens')
                .set('x-auth-token', token)
                .send({ appName });
        };

        it('should return new third party app token', async () => {
            const res = await exec();

            expect(() => {
                jwt.verify(res.text, config.get('jwtSecret'))
            }).not.toThrow();
        });

        it('should store an access entry to DB', async () => {
            await exec();

            const accessEntry = await ThirdPartyAccess.findOne({
                createdBy: userId,
                appName
            });

            expect(accessEntry).toBeTruthy();
        });

        it('should return 201 if token was created', async () => {
            const res = await exec();

            expect(res.status).toBe(201);
        });

        it('should return 400 if clients token is not valid', async () => {
            token = 'test';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if a client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if permission denied', async () => {
            token = new User({
                ...mockUserData(),
                roles: []
            }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
    });

    describe('DELETE /:accessId', () => {
        let token, userId, accessId, appName;

        beforeEach(async () => {
            server = require('../../../index');

            userId = mongoose.Types.ObjectId().toHexString();
            appName = 'test';
            token = new User({
                _id: userId,
                roles: ['admin']
            }).generateAuthToken();

            const access = await ThirdPartyAccess.createNewAccess({
                createdBy: userId,
                appName,
            });
            accessId = access._id;
        });

        afterEach(async () => {
            await server.close();
            await ThirdPartyAccess.deleteMany({});
        });

        const exec = async () => {
            return await request(server)
                .delete('/api/access/third-party-app/tokens/' + accessId)
                .set('x-auth-token', token)
                .send();
        }

        it('should return the removed access entry', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'createdBy', 'appName'])
            );
        });

        it('should delete the access entry if input is valid', async () => {
            await exec();

            const storedAccessEntry = await ThirdPartyAccess.findById(accessId);

            expect(storedAccessEntry).toBeNull();
        });

        it('should return 400 if clients token is not valid', async () => {
            token = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if a client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if permission denied', async () => {
            token = new User({ roles: [] }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if accessId is not valid', async () => {
            accessId = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if accessId is not found', async () => {
            accessId = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });
});
