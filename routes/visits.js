const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Visit } = require('../models/visit');
const { auth, allowedFor, thirdPartyAppAuth } = require('../middleware');

const NOT_FOUND_MSG = 'An user has not been found for given card ID.';

router.post('/', thirdPartyAppAuth, async (req, res) => {
    const { cardId } = req.body;

    const user = await User.findOne({ cardId });

    if (!user) return res.status(404).send(NOT_FOUND_MSG);

    const visit = await Visit.createNewVisit(user);

    res.status(201).send(visit);
});

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const visits = await Visit.find().sort({ _id: -1 });
    return res.send(visits);
});

module.exports = router;
