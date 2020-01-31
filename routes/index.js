const router = require('express').Router();
const users = require('./users');
const visits = require('./visits');
const access = require('./access');

router.use('/users', users);
router.use('/visits', visits);
router.use('/access', access);

module.exports = router;
