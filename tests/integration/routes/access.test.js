const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');

let server;

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
        it.todo('should return all access records');
        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');
    });

    describe('POST /', () => {
        let token;

        beforeEach(async () => {
            server = require('../../../index');
        });

        afterEach(async () => {
            await server.close();
        });

        const exec = async () => {
            return await request(server)
                .post('/api/access/third-party-app/tokens')
                .set('x-auth-token', token);
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
        });

        it.todo('should return new third party app token');
        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');
    });

    describe('DELETE /:accessId', () => {
        it.todo('should delete the access record if input is valid');
        it.todo('should return the removed access record');

        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');

        it.todo('should return 404 if accessId is not valid');
        it.todo('should return 404 if accessId is not found');
    });
});
