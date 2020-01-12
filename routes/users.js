const config = require('config');
const express = require('express');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send(
        'Acess denied. No token provided.'
    );

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}

const allowedFor = (allowableRoles) =>
    (req, res, next) => {
        const hasPermissionRoles = req.user.roles
            .some(role => allowableRoles.includes(role));
        if (!hasPermissionRoles) {
            return res.status(403).send('Permission denied.');
        }

        next();
    }

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

module.exports = router;