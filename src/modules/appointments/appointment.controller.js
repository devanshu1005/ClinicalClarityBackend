const appointmentService = require('./appointment.service');

const bookAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      clinicId,
      appointmentDate,
      startTime,
      endTime,
    } = req.body;

   const patientId = req.user.userId;

    if (
      !doctorId ||
      !clinicId ||
      !appointmentDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const appointment = await appointmentService.bookAppointment({
      doctorId,
      clinicId,
      appointmentDate,
      startTime,
      endTime,
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
};
