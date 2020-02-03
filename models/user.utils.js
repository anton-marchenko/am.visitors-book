const Joi = require('@hapi/joi');

const loginSchema = {
    login: Joi.string().min(3).max(50).required()
};

const passwordSchema = {
    password: Joi.string().min(3).max(50).required()
};

const baseValidator = () => {
    return Joi.object({
        name: {
            first: Joi.string().min(2).max(50).required(),
            patronymic: Joi.string().min(2).max(50).required(),
            last: Joi.string().min(2).max(50).required()
        },
        phone: Joi.string().max(50),
        cardId: Joi.string().max(50)
    }).append(loginSchema);
};

const withPasswordValidation = (validator) => {
    return validator().append(passwordSchema);
};

const withEditedUserPasswordValidation = (validator) => {
    return validator()
        .keys({ password: Joi.any() })
        .when(
            Joi.object({ password: Joi.exist() }).unknown(),
            {
                then: Joi.object({
                    password: Joi.string().min(3).max(50)
                })
            }
        );
};

const editedUserValidator = (user) => {
    return withEditedUserPasswordValidation(baseValidator).validate(user)
};

const createdUserValidator = (user) => {
    return withPasswordValidation(baseValidator).validate(user)
}

const signInUserValidator = (data) => {
    return Joi.object({
        ...loginSchema,
        ...passwordSchema
    }).validate(data)
}

exports.baseValidator = baseValidator;
exports.createdUserValidator = createdUserValidator;
exports.editedUserValidator = editedUserValidator;
exports.signInUserValidator = signInUserValidator;
