const express = require('express');
const router = express.Router();
const {
    User,
    createdUserValidator,
    editedUserValidator
} = require('../models/user');
const {
    auth,
    allowedFor,
    validate,
    validateObjectId
} = require('../middleware');

const NOT_FOUND_MSG = 'The user with the given ID was not found.';

const createUserMiddleware = [
    auth,
    allowedFor(['admin']),
    validate(createdUserValidator)
];
const editUserMiddleware = [
    auth,
    allowedFor(['admin']),
    validateObjectId,
    validate(editedUserValidator)
];

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const users = await User.find().sort('name');
    return res.send(users);
});

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send(NOT_FOUND_MSG);

    res.send(user);
});

router.post('/', createUserMiddleware, async (req, res) => {
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

router.put('/:id', editUserMiddleware, async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send(NOT_FOUND_MSG);

    res.status(200).send('OK');
});

module.exports = router;