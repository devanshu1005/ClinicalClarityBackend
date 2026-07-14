const router = require('express').Router();

const dashboardController =
  require('./dashboard.controller');

const optionalAuth =
  require('../../middlewares/optionalAuth.middleware');

router.get(
  '/',
  optionalAuth,
  dashboardController.getDashboard
);

module.exports = router;