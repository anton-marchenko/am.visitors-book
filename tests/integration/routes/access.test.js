const request = require('supertest');
const mongoose = require('mongoose');

let server;

describe('/api/access/tokens/validate', () => {

    beforeEach(async () => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
    });

    describe('POST /', () => {
        it.todo('should return false if the token is not valid');
        it.todo('should return true if the token is valid');
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
