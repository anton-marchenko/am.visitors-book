const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const generateHashedPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
}

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
    login: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    phone: {
        type: String,
        maxlength: 50
    },
    roles: [String],
    blocked: Boolean,
});



userSchema.statics.publicFields = function () {
    return [
        '_id',
        'name',
        'phone',
        'login',
        'roles',
        'blocked'
    ]
}

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        roles: this.roles
    }, config.get('jwtSecret'));

    return token;
}


userSchema.statics.getPublicData = function (user) {
    return this.publicFields()
        .reduce(
            (acc, field) => (
                (user[field] !== undefined)
                    ? { ...acc, [field]: user[field] }
                    : { ...acc }
            ),
            {}
        );
};

userSchema.statics.createNewUser = async function ({
    name: { first, patronymic, last },
    login,
    password: plainPassword,
    phone
}) {
    const hashedPassword = await generateHashedPassword(plainPassword);

    const user = new User({
        name: { first, patronymic, last },
        login,
        password: hashedPassword,
        phone
    });

    await user.save();

    return this.getPublicData(user);
}

userSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.patronymic} ${this.name.last}`;
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: {
            first: Joi.string().min(2).max(50).required(),
            patronymic: Joi.string().min(2).max(50).required(),
            last: Joi.string().min(2).max(50).required()
        },
        phone: Joi.string().max(50),
        password: Joi.string().min(3).max(50).required(),
        login: Joi.string().min(3).max(50).required()
    }

    return Joi.object(schema).validate(user)
}

exports.User = User;
exports.validator = validateUser