const router = require('express').Router();
const users = require('./users');
const visits = require('./visits');
const access = require('./access');
const tokens = require('./tokens');
const signIn = require('./sign-in');

router.use('/users', users);
router.use('/visits', visits);
router.use('/sign-in', signIn);
router.use('/access/tokens', tokens);
router.use('/access/third-party-app/tokens/', access);

module.exports = router;
