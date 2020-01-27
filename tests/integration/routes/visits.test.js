const request = require('supertest');
const mongoose = require('mongoose');
const { Visit } = require('../../../models/visit');
const { User } = require('../../../models/user');

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

describe('/api/visits', () => {
    let server,
        token,
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
        const user = new User(userData);
        await user.save();

        token = new User({ roles: ['admin'] }).generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await Visit.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /', () => {

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

        it.todo('should return 400 if the token is not valid');
        it.todo('should return 401 if the client is not logged in');
        it.todo('should return 403 if permission denied');
        it.todo('should return 404 if an user has not been found for given card ID');
    });
});