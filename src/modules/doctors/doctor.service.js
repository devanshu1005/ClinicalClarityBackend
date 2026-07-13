const Doctor = require('./doctor.model');
const Clinic = require('../clinics/clinic.model');
const Appointment = require('../appointments/appointment.model');
const generateSlots = require('../../utils/slotGenerator');

const createDoctor = async (payload) => {
  const doctor = await Doctor.create(payload);
  return doctor;
};

const getAllDoctors = async () => {
  const doctors = await Doctor.find({ isActive: true })
    .populate('clinicIds', 'name shortAddress fullAddress thumbnailImage')
    .sort({ createdAt: -1 });

  return doctors;
};

const getDoctorById = async (
  doctorId,
  appointmentDate
) => {

  const doctor = await Doctor.findById(doctorId)
    .populate(
      'clinicIds',
      'name shortAddress'
    );

  if (!doctor) {
    return null;
  }

  const bookedAppointments =
    await Appointment.find({
      doctorId,
      appointmentDate,
      status: "BOOKED",
    });

  const bookedSlotSet =
    new Set(
      bookedAppointments.map(
        (appointment) =>
          `${appointment.startTime}-${appointment.endTime}`
      )
    );

  const generatedSlots =
    generateSlots(
      doctor.availability.startTime,
      doctor.availability.endTime,
      doctor.availability.slotDuration
    );

  const availableSlots =
    generatedSlots.filter((slot) => {

      const key =
        `${slot.start}-${slot.end}`;

      return !bookedSlotSet.has(key);
    });

  const dayName = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
  });

  if (!doctor.availability.workingDays.includes(dayName)) {
    return {
      doctor,
      availableSlots: [],
    };
  }

  return {
    doctor,
    availableSlots,
  };
};

const validateClinicIds = async (clinicIds = []) => {
  const clinics = await Clinic.find({ _id: { $in: clinicIds } }).select('_id');
  return clinics;
};

const getDoctorsByClinicId = async (clinicId) => {
  const doctors = await Doctor.find({
    clinicIds: clinicId,
    isActive: true,
  }).sort({ createdAt: -1 });

  return doctors;
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  validateClinicIds,
  getDoctorsByClinicId,
};