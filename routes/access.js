const express = require('express');
const router = express.Router();
const { auth, allowedFor } = require('../middleware');
const { ThirdPartyAccess } = require('../models/third-party-access');

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

module.exports = router;
