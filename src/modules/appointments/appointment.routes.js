const router = require('express').Router();
const appointmentController = require('./appointment.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post(
  '/',
  authMiddleware,
  appointmentController.bookAppointment
);

router.get(
  "/",
  authMiddleware,
  appointmentController.getAppointments
);

router.get(
  "/:appointmentId",
  authMiddleware,
  appointmentController.getAppointmentById
);

module.exports = router;