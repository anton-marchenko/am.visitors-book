const routes = require('./routes');
const db = require('./db');
const config = require('./config');
const logging = require('./logging');
const errorCatcher = require('./error-catcher');

module.exports = {
    routes,
    config,
    logging,
    errorCatcher,
    db
}
