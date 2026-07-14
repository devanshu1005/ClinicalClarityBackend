const Clinic = require('./clinic.model');
const Doctor = require('../doctors/doctor.model');

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

  if (!clinic) {
    return null;
  }

  const doctors = await Doctor.find({
    clinicIds: clinic._id,
    isActive: true,
  }).select(
    'name specialization qualification experienceYears profileImage bio averageRating totalReviews clinicIds'
  );

  return {
    clinic,
    doctors,
  };
};

module.exports = {
  createClinic,
  getAllClinics,
  getClinicById,
};