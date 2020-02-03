const Joi = require('@hapi/joi');

const baseValidator = () => {
    return Joi.object({
        name: {
            first: Joi.string().min(2).max(50).required(),
            patronymic: Joi.string().min(2).max(50).required(),
            last: Joi.string().min(2).max(50).required()
        },
        phone: Joi.string().max(50),
        cardId: Joi.string().max(50),
        login: Joi.string().min(3).max(50).required()
    });
};

const withPasswordValidation = (validator) => {
    return validator().append({
        password: Joi.string().min(3).max(50).required()
    });
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

function createdUserValidator(user) {
    return withPasswordValidation(baseValidator).validate(user)
}

exports.baseValidator = baseValidator;
exports.createdUserValidator = createdUserValidator;
exports.editedUserValidator = editedUserValidator;
