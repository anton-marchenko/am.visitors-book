const allowedFor = require('./allowed-for');
const auth = require('./auth');
const error = require('./error');
const validateObjectId = require('./validate-object-id');
const thirdPartyAppAuth = require('./third-party-app-auth');
const validate = require('./validate');

module.exports = {
    allowedFor,
    auth,
    error,
    validate,
    thirdPartyAppAuth,
    validateObjectId
};
