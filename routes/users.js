const express = require('express');
const router = express.Router();
const { User, validator } = require('../models/user');
const {
    auth,
    allowedFor,
    validate,
    validateObjectId
} = require('../middleware');

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.post('/', [auth, validate(validator)], async (req, res) => {
    res.status(201).send('Created');
});

module.exports = router;