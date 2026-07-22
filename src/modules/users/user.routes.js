const router = require('express').Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.put(
  "/profile",
  authMiddleware,
  userController.updateProfile
);

router.get(
  "/profile",
  authMiddleware,
  userController.getProfile
);

module.exports = router;