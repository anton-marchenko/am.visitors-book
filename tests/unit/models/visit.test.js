const mongoose = require('mongoose');
const { visitValidator } = require('../../../models/visit');


describe('visit model validation', () => {
    it('should return an error if userId is not valid ObjectId', () => {
        const mockVisit = {
            userId: 1
        };

        const { error } = visitValidator(mockVisit);

        expect(error).toBeTruthy();
    });

    it('should return an error if userId is not exist', () => {
        const mockVisit = {
            userId: ''
        };

        const { error } = visitValidator(mockVisit);

        expect(error).toBeTruthy();
    });

    it('should not return an error if userId is valid ObjectId', () => {
        const mockVisit = {
            userId: mongoose.Types.ObjectId().toHexString()
        };

        const { error } = visitValidator(mockVisit);

        expect(error).toBeFalsy();
    });
});