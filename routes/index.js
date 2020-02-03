const router = require('express').Router();
const users = require('./users');
const visits = require('./visits');
const access = require('./access');
const signIn = require('./sign-in');

router.use('/users', users);
router.use('/visits', visits);
router.use('/access', access);
router.use('/sign-in', signIn);

module.exports = router;
