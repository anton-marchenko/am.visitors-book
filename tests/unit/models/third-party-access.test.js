const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {
    ThirdPartyAccess,
    validator
} = require('../../../models/third-party-access');

describe('ThirdPartyAccess model', () => {
    describe('JWT', () => {

        it('should return valid JWT token for a third party app', () => {
            const payload = {
                _id: new mongoose.Types.ObjectId().toHexString(),
                createdBy: new mongoose.Types.ObjectId().toHexString(),
                appName: 'test'
            };

            const access = new ThirdPartyAccess(payload);
            const token = access.generateAuthToken();

            const decoded = jwt.verify(token, config.get('jwtSecret'));

            expect(decoded).toMatchObject(payload);
        });
    });

    describe('model validation', () => {
        const genString = (length) => new Array(length + 1).join('a');
        let access;

        beforeEach(() => {
            access = {
                createdBy: mongoose.Types.ObjectId().toHexString(),
                appName: 'test'
            };
        });

        it('should return no error if there is a valid input', () => {
            const { error } = validator(access);

            expect(error).toBeFalsy();
        });

        it('should return an error if there is an unexpected field in the input object', () => {
            access.mockUnexpectedField = 'test';

            const { error } = validator(access);

            expect(error).toBeTruthy();
        });

        it('should return an error if createdBy is not valid ObjectId', () => {
            access.createdBy = 1;

            const { error } = validator(access);

            expect(error).toBeTruthy();
        });

        it('should return an error if appName is not exist', () => {
            access.appName = '';

            const { error } = validator(access);

            expect(error).toBeTruthy();
        });

        it('should return an error if appName is less than 3 characters', () => {
            access.appName = '12';

            const { error } = validator(access);

            expect(error).toBeTruthy();
        });

        it('should return an error if appName is more than 50 characters', () => {
            access.appName = genString(51);

            const { error } = validator(access);

            expect(error).toBeTruthy(); 
        });
    });
});
