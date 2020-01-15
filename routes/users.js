const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth'); // TODO - index.js for middlewares
const allowedFor = require('../middleware/allowed-for');
const validateObjectId = require('../middleware/validate-object-id');

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

router.get('/:id', [validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);

    res.send(user);
});

module.exports = router;