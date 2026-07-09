const router = require('express').Router();
const authController = require('./auth.controller');

router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;