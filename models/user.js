const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    createdUserValidator,
    editedUserValidator,
    signInUserValidator
} = require('./user.utils')

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
    cardId: {
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
        'cardId',
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
    cardId,
    phone
}) {
    const hashedPassword = await generateHashedPassword(plainPassword);

    const user = new User({
        name: { first, patronymic, last },
        login,
        password: hashedPassword,
        cardId,
        phone
    });

    await user.save();

    return this.getPublicData(user);
}

userSchema.statics.updateUser = async function (id, {
    name: { first, patronymic, last },
    login,
    password: plainPassword,
    cardId,
    phone
}) {
    const updatedData = {
        name: { first, patronymic, last },
        login
    };

    if (plainPassword !== undefined) {
        updatedData.password = await generateHashedPassword(plainPassword);
    }

    // Needs to move this logic to external builder
    if (phone !== undefined) {
        updatedData.phone = phone;
    }

    // Needs to move this logic to external builder
    if (cardId !== undefined) {
        updatedData.cardId = cardId;
    }

    const user = await this.findByIdAndUpdate(
        id,
        updatedData,
        { 'new': true }
    );

    if (!user) return;

    return this.getPublicData(user);
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.createdUserValidator = createdUserValidator;
exports.editedUserValidator = editedUserValidator;
exports.signInUserValidator = signInUserValidator;
