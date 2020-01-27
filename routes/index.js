const router = require('express').Router();
const users = require('./users');
const visits = require('./visits');

router.use('/users', users);
router.use('/visits', visits);

module.exports = router;
