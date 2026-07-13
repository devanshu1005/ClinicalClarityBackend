const router = require('express').Router();

const doctorReviewController = require('./doctorReview.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Submit a review (Authenticated)
router.post(
  '/',
  authMiddleware,
  doctorReviewController.createReview
);

// Get all reviews of a doctor (Public)
router.get(
  '/:doctorId',
  doctorReviewController.getReviewsByDoctorId
);

module.exports = router;