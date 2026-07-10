const Doctor = require('./doctor.model');
const Clinic = require('../clinics/clinic.model');

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

const getDoctorById = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).populate(
    'clinicIds',
    'name shortAddress fullAddress thumbnailImage coverImage'
  );

  return doctor;
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