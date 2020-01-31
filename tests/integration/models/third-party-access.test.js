const { ThirdPartyAccess } = require('../../../models/third-party-access');
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

describe('ThirdPartyAccess - createNewAccess()', () => {
    let userId,
        appName;

    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        await ThirdPartyAccess.deleteMany({});
        await User.deleteMany({});
    });

    const exec = async () => {
        appName = 'test';
        const userData = mockUserData();
        const { insertedId } = await User.collection.insertOne(userData);
        userId = insertedId.toHexString();

        return ThirdPartyAccess.createNewAccess({
            createdBy: userId,
            appName
        });
    }

    it('should save new access', async () => {
        await exec();

        const access = await ThirdPartyAccess.findOne({ createdBy: userId, appName });

        expect(access).not.toBeNull();
    });

    it('should return new access', async () => {
        const access = await exec();

        expect(access).toHaveProperty('_id');
        expect(access).toHaveProperty('createdBy');
        expect(access).toHaveProperty('appName');
        expect(access.appName).toBe(appName);
        expect(access.createdBy.toHexString()).toBe(userId);
    });
});
