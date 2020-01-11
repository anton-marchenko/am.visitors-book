const winston = require('winston');

module.exports = (err, req, res) => {
    console.error(err.message, err);

    res.status(500).send('Internal server error.');
}
