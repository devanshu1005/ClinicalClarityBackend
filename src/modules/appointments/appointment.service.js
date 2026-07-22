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

const getAppointments = async (
  patientId,
  status
) => {
  const filter = {
    patientId,
  };

  if (status) {
    filter.status = status;
  }

  return Appointment.find(filter)
    .populate({
      path: "doctorId",
      select:
        "name specialization qualification experienceYears profileImage averageRating totalReviews",
    })
    .populate({
      path: "clinicId",
      select:
        "name shortAddress fullAddress thumbnailImage coverImage location",
    })
    .sort({
      appointmentDate: -1,
      startTime: -1,
    })
    .lean();
};

const getAppointmentById = async (
  appointmentId,
  patientId
) => {
  return Appointment.findOne({
    _id: appointmentId,
    patientId,
  })
    .populate({
      path: "doctorId",
      select:
        "name specialization qualification experienceYears profileImage bio averageRating totalReviews languages",
    })
    .populate({
      path: "clinicId",
      select:
        "name shortAddress fullAddress thumbnailImage coverImage galleryImages location infoCard ctaLabel",
    })
    .lean();
};

module.exports = {
  bookAppointment,
  getBookedAppointments,
  getAppointments,
  getAppointmentById,
};