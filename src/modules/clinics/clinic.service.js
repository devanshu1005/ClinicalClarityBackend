const Clinic = require('./clinic.model');

const createClinic = async (payload) => {
  const clinic = await Clinic.create(payload);
  return clinic;
};

const getAllClinics = async () => {
  const clinics = await Clinic.find({ isActive: true }).sort({ createdAt: -1 });
  return clinics;
};

const getClinicById = async (clinicId) => {
  const clinic = await Clinic.findById(clinicId);
  return clinic;
};

module.exports = {
  createClinic,
  getAllClinics,
  getClinicById,
};