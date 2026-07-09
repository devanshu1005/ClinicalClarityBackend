const mongoose = require('mongoose');
const clinicService = require('./clinic.service');

const createClinic = async (req, res, next) => {
  try {
    const {
      name,
      shortAddress,
      fullAddress,
      city,
      state,
      postalCode,
      country,
      thumbnailImage,
      coverImage,
      galleryImages,
      doctorCount,
      doctorPreviewImages,
      infoCard,
      ctaLabel,
      coordinates,
    } = req.body;

    if (!name || !shortAddress || !fullAddress || !thumbnailImage || !coverImage) {
      return res.status(400).json({
        success: false,
        message:
          'name, shortAddress, fullAddress, thumbnailImage, and coverImage are required',
      });
    }

    const clinic = await clinicService.createClinic({
      name,
      shortAddress,
      fullAddress,
      city,
      state,
      postalCode,
      country,
      thumbnailImage,
      coverImage,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      doctorCount: doctorCount || 0,
      doctorPreviewImages: Array.isArray(doctorPreviewImages)
        ? doctorPreviewImages
        : [],
      infoCard: infoCard || {},
      ctaLabel: ctaLabel || 'Get Directions',
      coordinates: coordinates || {},
    });

    return res.status(201).json({
      success: true,
      message: 'Clinic created successfully',
      data: clinic,
    });
  } catch (error) {
    next(error);
  }
};

const getAllClinics = async (req, res, next) => {
  try {
    const clinics = await clinicService.getAllClinics();

    return res.status(200).json({
      success: true,
      message: 'Clinics fetched successfully',
      count: clinics.length,
      data: clinics,
    });
  } catch (error) {
    next(error);
  }
};

const getClinicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clinic id',
      });
    }

    const clinic = await clinicService.getClinicById(id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Clinic fetched successfully',
      data: clinic,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClinic,
  getAllClinics,
  getClinicById,
};