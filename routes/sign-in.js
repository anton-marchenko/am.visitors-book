const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    res.send('OK');
});

module.exports = router;
