const Appointment = require('./appointment.model');

const bookAppointment = async (payload) => {
  const existingAppointment = await Appointment.findOne({
    doctorId: payload.doctorId,
    appointmentDate: payload.appointmentDate,
    startTime: payload.startTime,
    status: 'BOOKED',
  });

  if (existingAppointment) {
    throw new Error('This slot is already booked');
  }

  return Appointment.create(payload);
};

const getBookedAppointments = async (doctorId, date) => {
  return Appointment.find({
    doctorId,
    appointmentDate: date,
    status: 'BOOKED',
  });
};

module.exports = {
  bookAppointment,
  getBookedAppointments,
};