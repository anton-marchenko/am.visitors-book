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

describe('/api/access/tokens/validate', () => {

    beforeEach(async () => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
    });

    describe('POST /', () => {

        let token;

        const exec = async () => {
            return await request(server)
                .post('/api/access/tokens/validate')
                .set('x-auth-token', token);
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
        });

        it('should return 200 if the token is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });

        it('should return 400 if the token is not valid', async () => {
            const mockJwtSecret = 'test';
            const mockTokenData = 'test';
            token = jwt.sign(mockTokenData, mockJwtSecret);

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if the token is not provided', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

    });

});

describe('/api/access/third-party-app/tokens', () => {
    describe('GET /', () => {
        it.todo('should return all access entries');
        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');
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
        it.todo('should delete the access entry if input is valid');
        it.todo('should return the removed access entry');

        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');

        it.todo('should return 404 if accessId is not valid');
        it.todo('should return 404 if accessId is not found');
    });
});
