const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');

let server;

describe('/api/sign-in', () => {

    beforeEach(async () => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
    });

    const exec = async () => {
        return await request(server)
            .post('/api/sign-in')
            .send({});
    };

    it('should return new JWT if input is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it.todo('should return 200 if input is valid');
    it.todo('should return 400 if input is not valid');
    it.todo('should return 400 if an user was not found');
    it.todo('should return 400 if a password is not valid');
});
