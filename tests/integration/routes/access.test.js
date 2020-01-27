const request = require('supertest');
const mongoose = require('mongoose');

let server;

describe('/api/access', () => {

    beforeEach(async () => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
    });

    describe('POST /validate-token', () => {
        it.todo('should return false if the token is not valid');
        it.todo('should return true if the token is valid');
    });

    describe('POST /third-party-app-token', () => {
        it.todo('should return new third party app token');
        it.todo('should return 400 if clients token is not valid');
        it.todo('should return 401 if a client is not logged in');
        it.todo('should return 403 if permission denied');
    });

});
