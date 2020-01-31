const express = require('express');
const router = express.Router();
const { auth } = require('../middleware');

router.post('/tokens/validate', auth, async (req, res) => {
    return res.status(200).send('OK');
});

module.exports = router;
