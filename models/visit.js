const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const visitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Visit = mongoose.model('Visit', visitSchema);

const validator = (visit) => {
    return Joi.object({
        userId: Joi.objectId().required()
    }).validate(visit);
};

exports.Visit = Visit;
exports.visitValidator = validator;
