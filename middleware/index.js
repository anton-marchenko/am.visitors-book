const allowedFor = require('./allowed-for');
const auth = require('./auth');
const error = require('./error');
const validateObjectId = require('./validate-object-id');
const validate = require('./validate');

module.exports = {
    allowedFor,
    auth,
    error,
    validate,
    validateObjectId
};
