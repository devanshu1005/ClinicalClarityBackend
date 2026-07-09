const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Clinical Clarity API v1',
  });
});

// Example module routes
// router.use('/auth', require('../modules/auth/auth.routes'));
// router.use('/users', require('../modules/users/user.routes'));
router.use('/onboarding', require('../modules/onboarding/onboarding.routes'));
router.use('/auth', require('../modules/auth/auth.routes'));

module.exports = router;