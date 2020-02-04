const express = require('express');
const router = express.Router();
const { auth, allowedFor, validateObjectId } = require('../middleware');
const { ThirdPartyAccess } = require('../models/third-party-access');

const NOT_FOUND_MSG = 'An access entry with the given ID was not found';
const tokenDeleteMiddleware = [auth, allowedFor('admin'), validateObjectId];

router.post('/tokens/validate', auth, async (req, res) => {
    return res.status(200).send('OK');
});

router.post('/third-party-app/tokens', [auth, allowedFor('admin')], async (req, res) => {
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

router.delete('/third-party-app/tokens/:id', tokenDeleteMiddleware, async (req, res) => {
    const accessEntry = await ThirdPartyAccess.findByIdAndRemove(req.params.id);

    if (!accessEntry) return res.status(404).send(NOT_FOUND_MSG);

    return res.send(accessEntry);
});

module.exports = router;
