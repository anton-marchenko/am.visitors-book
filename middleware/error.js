const winston = require('winston');

module.exports = (err, req, res) => {
    winston.error(err.message); // TODO - check properly logger work

    res.status(500).send('Internal server error.');
}
