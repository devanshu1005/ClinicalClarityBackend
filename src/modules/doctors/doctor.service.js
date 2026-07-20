const Doctor = require('./doctor.model');
const Clinic = require('../clinics/clinic.model');
const Appointment = require('../appointments/appointment.model');
const generateSlots = require('../../utils/slotGenerator');

const createDoctor = async (payload) => {
  const doctor = await Doctor.create(payload);
  return doctor;
};

const getAllDoctors = async () => {
  return await Doctor.find()
    .populate(
      "clinics.clinicId",
      "name shortAddress location"
    )
    .lean();
};

const getDoctorById = async (
  doctorId,
  clinicId,
  appointmentDate
) => {

  const doctor = await Doctor.findById(doctorId)
    .populate(
      "clinics.clinicId",
      "name shortAddress location"
    )
    .lean();

  if (!doctor) {
    return null;
  }

  const selectedClinic = doctor.clinics.find(
    (clinic) =>
      clinic.clinicId._id.toString() === clinicId
  );

  if (!selectedClinic) {
    return null;
  }

  const availability = selectedClinic.availability;

  const bookedAppointments = await Appointment.find({
    doctorId,
    clinicId,
    appointmentDate,
    status: "BOOKED",
  });

  const bookedSlotSet = new Set(
    bookedAppointments.map(
      (appointment) =>
        `${appointment.startTime}-${appointment.endTime}`
    )
  );

  const generatedSlots = generateSlots(
    availability.startTime,
    availability.endTime,
    availability.slotDuration
  );

  const availableSlots = generatedSlots.filter((slot) => {
    const key = `${slot.start}-${slot.end}`;
    return !bookedSlotSet.has(key);
  });

  const dayName = new Date(appointmentDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

  if (!availability.workingDays.includes(dayName)) {
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

const getNearbyDoctors = async (
  latitude,
  longitude,
  radius
) => {
  const doctors = await Clinic.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        maxDistance: radius,
        spherical: true,
        query: {
          isActive: true,
        },
      },
    },

    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: 'clinics.clinicId',
        as: 'doctors',
      },
    },
    {
      $unwind: '$doctors',
    },

    {
      $match: {
        'doctors.isActive': true,
      },
    },

    // A doctor can belong to multiple clinics.
    // Keep only the nearest clinic for each doctor.
    {
      $sort: {
        distance: 1,
      },
    },

    {
      $group: {
        _id: '$doctors._id',

        doctor: {
          $first: '$doctors',
        },

        nearestClinic: {
          $first: {
            _id: '$_id',
            name: '$name',
            shortAddress: '$shortAddress',
            fullAddress: '$fullAddress',
            thumbnailImage: '$thumbnailImage',
            coverImage: '$coverImage',
            distanceInMeters: '$distance',
          },
        },
      },
    },

    {
      $addFields: {
        'nearestClinic.distanceInKm': {
          $round: [
            {
              $divide: [
                '$nearestClinic.distanceInMeters',
                1000,
              ],
            },
            2,
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,

        doctor: {
          _id: '$doctor._id',
          name: '$doctor.name',
          specialization: '$doctor.specialization',
          qualification: '$doctor.qualification',
          experienceYears: '$doctor.experienceYears',
          profileImage: '$doctor.profileImage',
          bio: '$doctor.bio',
          averageRating: '$doctor.averageRating',
          totalReviews: '$doctor.totalReviews',
        },

        nearestClinic: 1,
      },
    },

    {
      $sort: {
        'nearestClinic.distanceInMeters': 1,
      },
    },
  ]);

  return doctors;
};

const getPopularDoctors = async (limit = 10) => {
  return Doctor.aggregate([
    {
      $match: {
        isActive: true,
      },
    },

    {
      $sort: {
        averageRating: -1,
        totalReviews: -1,
      },
    },

    {
      $limit: limit,
    },

    {
      $lookup: {
        from: "clinics",
        localField: "clinics.clinicId",
        foreignField: "_id",
        as: "clinicDetails",
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        specialization: 1,
        qualification: 1,
        experienceYears: 1,
        profileImage: 1,
        bio: 1,
        averageRating: 1,
        totalReviews: 1,

        clinics: {
          $map: {
            input: "$clinics",
            as: "doctorClinic",
            in: {
              clinic: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$clinicDetails",
                      as: "clinic",
                      cond: {
                        $eq: [
                          "$$clinic._id",
                          "$$doctorClinic.clinicId",
                        ],
                      },
                    },
                  },
                  0,
                ],
              },
              availability: "$$doctorClinic.availability",
            },
          },
        },
      },
    },
  ]);
};

const searchDoctors = async (query) => {
  return Doctor.aggregate([
    {
      $match: {
        isActive: true,
      },
    },

    {
      $lookup: {
        from: "clinics",
        localField: "clinics.clinicId",
        foreignField: "_id",
        as: "clinicDetails",
      },
    },

    {
      $match: {
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          {
            specialization: {
              $regex: query,
              $options: "i",
            },
          },
          {
            qualification: {
              $regex: query,
              $options: "i",
            },
          },
          {
            "clinicDetails.name": {
              $regex: query,
              $options: "i",
            },
          },
          {
            "clinicDetails.shortAddress": {
              $regex: query,
              $options: "i",
            },
          },
          {
            "clinicDetails.fullAddress": {
              $regex: query,
              $options: "i",
            },
          },
        ],
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        specialization: 1,
        qualification: 1,
        experienceYears: 1,
        consultationFee: 1,
        profileImage: 1,
        averageRating: 1,
        totalReviews: 1,

        clinics: {
          $map: {
            input: "$clinics",
            as: "doctorClinic",
            in: {
              $let: {
                vars: {
                  clinic: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$clinicDetails",
                          as: "c",
                          cond: {
                            $eq: [
                              "$$c._id",
                              "$$doctorClinic.clinicId",
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  _id: "$$clinic._id",
                  name: "$$clinic.name",
                  shortAddress: "$$clinic.shortAddress",
                  thumbnailImage: "$$clinic.thumbnailImage",
                  availability: "$$doctorClinic.availability",
                },
              },
            },
          },
        },
      },
    },

    {
      $sort: {
        averageRating: -1,
        totalReviews: -1,
      },
    },

    {
      $limit: 20,
    },
  ]);
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  validateClinicIds,
  getDoctorsByClinicId,
  getNearbyDoctors,
  getPopularDoctors,
  searchDoctors,
};