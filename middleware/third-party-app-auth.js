const config = require('config');
const jwt = require('jsonwebtoken');
const { ThirdPartyAccess } = require('../models/third-party-access');

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send(
        'Acess denied. No token provided.'
    );

    try {
        const { _id } = jwt.verify(token, config.get('jwtSecret'));

        const access = await ThirdPartyAccess.findById(_id);

        if (!access) {
            return res.status(403).send('Permission denied');
        }

        next();

    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}
