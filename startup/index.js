const routes = require('./routes');
const db = require('./db');
const config = require('./config');
const logging = require('./logging');

module.exports = {
    routes,
    config,
    logging,
    db
}
