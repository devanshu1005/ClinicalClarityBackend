const mongoose = require('mongoose');
const doctorReviewService = require('./doctorReview.service');

const createReview = async (req, res, next) => {
  try {
    const { doctorId, appointmentId, rating, review } = req.body;

    const patientId = req.user.userId;

    if (!doctorId || !appointmentId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'doctorId, appointmentId and rating are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctorId',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointmentId',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const reviewData = await doctorReviewService.createReview({
      doctorId,
      appointmentId,
      patientId,
      rating,
      review,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: reviewData,
    });
  } catch (error) {
    next(error);
  }
};

const getReviewsByDoctorId = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctorId',
      });
    }

    const reviews = await doctorReviewService.getReviewsByDoctorId(
      doctorId
    );

    return res.status(200).json({
      success: true,
      message: 'Doctor reviews fetched successfully',
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByDoctorId,
};