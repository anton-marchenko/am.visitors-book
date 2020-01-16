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

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.post('/', [auth], async (req, res) => {
    res.send(403).send('Permission denied');
});

module.exports = router;