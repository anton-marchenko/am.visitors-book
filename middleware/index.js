const allowedFor = require('./allowed-for');
const auth = require('./auth');
const error = require('./error');
const validateObjectId = require('./validate-object-id');

module.exports = {
    allowedFor,
    auth,
    error,
    validateObjectId
};
