const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
    // return res.status(403).send('Permission denied.');
});

module.exports = router;