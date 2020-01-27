const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Visit } = require('../models/visit');

router.post('/', async (req, res) => {
    const { cardId } = req.body;

    res.status(201).send('OK');
});

module.exports = router;
