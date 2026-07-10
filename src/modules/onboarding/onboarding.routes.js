const router = require('express').Router();
const onboardingController = require('./onboarding.controller');

router.post('/', onboardingController.createOnboarding);
router.get('/', onboardingController.getAllOnboarding);

module.exports = router;