const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
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
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    return res.status(500).send('Route error');
});

module.exports = router;