const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const thirdPartyAccessSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    appName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

thirdPartyAccessSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        createdBy: this.createdBy,
        appName: this.appName,
    }, config.get('jwtSecret'));

    return token;
}

const ThirdPartyAccess = mongoose.model('ThirdPartyAccess', thirdPartyAccessSchema);

const validator = (access) => {
    return Joi.object({
        createdBy: Joi.objectId().required(),
        appName: Joi.string().min(3).max(50).required()
    }).validate(access);
};

exports.ThirdPartyAccess = ThirdPartyAccess;
exports.validator = validator;