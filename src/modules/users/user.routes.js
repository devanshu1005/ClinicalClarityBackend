const router = require("express").Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  userController.updateProfile
);

router.get(
  "/profile",
  authMiddleware,
  userController.getProfile
);

module.exports = router;