const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        patronymic: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        last: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    roles: [String],
    blocked: Boolean,
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        roles: this.roles
    }, config.get('jwtSecret'));

    return token;
}

userSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.patronymic} ${this.name.last}`;
});

const User = mongoose.model('User', userSchema);

exports.User = User;
