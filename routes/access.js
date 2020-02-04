const express = require('express');
const router = express.Router();
const { auth, allowedFor, validateObjectId } = require('../middleware');
const { ThirdPartyAccess } = require('../models/third-party-access');

const NOT_FOUND_MSG = 'An access entry with the given ID was not found';
const tokenDeleteMiddleware = [auth, allowedFor('admin'), validateObjectId];

router.get('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const accessEntries = await ThirdPartyAccess.find().sort({ _id: -1 })

    return res.send(accessEntries);
});

router.post('/', [auth, allowedFor(['admin'])], async (req, res) => {
    const { _id, appName, createdBy } = await ThirdPartyAccess.createNewAccess({
        createdBy: req.user._id,
        appName: req.body.appName,
    });

    const token = new ThirdPartyAccess({
        _id,
        appName,
        createdBy
    }).generateAuthToken();

    return res.status(201).send(token);
});

router.delete('/:id', tokenDeleteMiddleware, async (req, res) => {
    const accessEntry = await ThirdPartyAccess.findByIdAndRemove(req.params.id);

    if (!accessEntry) return res.status(404).send(NOT_FOUND_MSG);

    return res.send(accessEntry);
});

module.exports = router;
