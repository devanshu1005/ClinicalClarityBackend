const mongoose = require('mongoose');
const doctorService = require('./doctor.service');
const generateSlots = require('../../utils/slotGenerator');

const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      specialization,
      qualification,
      experienceYears,
      profileImage,
      bio,
      clinicIds,
      availability,
    } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'name and specialization are required',
      });
    }

    if (!Array.isArray(clinicIds) || clinicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'clinicIds must be a non-empty array',
      });
    }

    const invalidClinicId = clinicIds.find(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidClinicId) {
      return res.status(400).json({
        success: false,
        message: `Invalid clinic id: ${invalidClinicId}`,
      });
    }

    const clinics = await doctorService.validateClinicIds(clinicIds);

    if (clinics.length !== clinicIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more clinicIds do not exist',
      });
    }

    const doctor = await doctorService.createDoctor({
      name,
      specialization,
      qualification,
      experienceYears,
      profileImage,
      bio,
      clinicIds,
      availability,
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorService.getAllDoctors();

    return res.status(200).json({
      success: true,
      message: 'Doctors fetched successfully',
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor id',
      });
    }

    if (!date) {

      return res.status(400).json({

        success: false,

        message: "date is required"

      });

    }

    const result = await doctorService.getDoctorById(id, date);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
};