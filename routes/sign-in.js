const express = require('express');
const router = express.Router();
const { validate } = require('../middleware');
const { signInUserValidator, validatePassword, User } = require('../models/user');

const ERROR_MSG = 'Invalid email or password';

router.post('/', validate(signInUserValidator), async (req, res) => {
    const user = await User.findOne({ login: req.body.login });

    if (!user) return res.status(400).send(ERROR_MSG);

    isPasswordValid = await validatePassword(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).send(ERROR_MSG);

    const token = user.generateAuthToken();
    res.send(token);
});

module.exports = router;
