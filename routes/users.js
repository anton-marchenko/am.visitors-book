const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.status(403).send('Permission denied.');
});

module.exports = router;