const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Visit } = require('../models/visit');

router.post('/', async (req, res) => {
    const { cardId } = req.body;

    const user = await User.findOne({ cardId });

    const visit = await Visit.createNewVisit(user);

    res.status(201).send(visit);
});

module.exports = router;
