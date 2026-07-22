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
      patientId,
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


const getAppointments = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { status } = req.query;

    const appointments =
      await appointmentService.getAppointments(
        patientId,
        status
      );

    const VALID_STATUSES = [
      "BOOKED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (
  req,
  res,
  next
) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user.userId;

    const appointment =
      await appointmentService.getAppointmentById(
        appointmentId,
        patientId
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
};
