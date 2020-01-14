const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const allowedFor = require('../middleware/allowed-for');

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    res.send(user);
});

module.exports = router;