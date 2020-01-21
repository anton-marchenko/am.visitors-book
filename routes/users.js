const express = require('express');
const bcrypt = require('bcrypt');
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
    const { name: { first, patronymic, last }, login, password, phone } = req.body;
    const user = new User({
        name: { first, patronymic, last },
        login,
        password,
        phone
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.status(201).send(User.getPublicData(user));
});

module.exports = router;