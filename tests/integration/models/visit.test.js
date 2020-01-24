const mongoose = require('mongoose');
const { Visit } = require('../../../models/visit');
const { User } = require('../../../models/user');

let server;

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

describe('visit - createNewVisit()', () => {
    let userId;

    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        await Visit.deleteMany({});
        await User.deleteMany({});
    });

    const exec = async () => {
        const userData = mockUserData();
        const { insertedId } = await User.collection.insertOne(userData);
        userId = insertedId.toHexString();

        return Visit.createNewVisit(userId);
    }

    it('should save new visit', async () => {
        await exec();

        const visit = Visit.findOne({ userId });

        expect(visit).not.toBeNull();
    });

    it('should return new visit', async () => {
        const visit = await exec();

        expect(visit).toHaveProperty('_id');
        expect(visit).toHaveProperty('userId');
        expect(visit.userId.toHexString()).toBe(userId);
    });
});
