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

router.post('/', [auth, allowedFor(['admin']), validate(validator)], async (req, res) => {
    const {
        name: { first, patronymic, last },
        login,
        password,
        phone
    } = req.body;

    const user = await User.createNewUser({
        name: { first, patronymic, last },
        login,
        password,
        phone
    });

    res.status(201).send(user);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.status(200).send('OK');
});

module.exports = router;