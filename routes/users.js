const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const allowedFor = require('../middleware/allowedFor');

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

module.exports = router;