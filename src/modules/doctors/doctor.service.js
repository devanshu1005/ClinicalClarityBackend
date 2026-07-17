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
        foreignField: 'clinicIds',
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
        from: 'clinics',
        localField: 'clinicIds',
        foreignField: '_id',
        as: 'clinics',
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
            input: '$clinics',
            as: 'clinic',
            in: {
              _id: '$$clinic._id',
              name: '$$clinic.name',
              shortAddress: '$$clinic.shortAddress',
              thumbnailImage: '$$clinic.thumbnailImage',
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
        localField: "clinicIds",
        foreignField: "_id",
        as: "clinics",
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
            "clinics.name": {
              $regex: query,
              $options: "i",
            },
          },

          {
            "clinics.shortAddress": {
              $regex: query,
              $options: "i",
            },
          },

          {
            "clinics.fullAddress": {
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

            as: "clinic",

            in: {

              _id: "$$clinic._id",

              name: "$$clinic.name",

              shortAddress:
                "$$clinic.shortAddress",

              thumbnailImage:
                "$$clinic.thumbnailImage",

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