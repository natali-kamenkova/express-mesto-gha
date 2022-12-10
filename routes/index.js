const router = require('express').Router();
const userRouts = require('./users');

router.use('/users', userRouts);

module.exports = router;
