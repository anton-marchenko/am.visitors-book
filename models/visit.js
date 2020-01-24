const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { User } = require('./user');

const visitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

visitSchema.statics.createNewVisit = async function (userId) {
    const visit = new Visit({ userId });

    await visit.save();

    return visit;
}

const Visit = mongoose.model('Visit', visitSchema);

const validator = (visit) => {
    return Joi.object({
        userId: Joi.objectId().required()
    }).validate(visit);
};

exports.Visit = Visit;
exports.visitValidator = validator;
