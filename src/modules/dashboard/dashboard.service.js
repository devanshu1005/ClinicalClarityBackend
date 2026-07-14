const Appointment = require('../appointments/appointment.model');

const doctorService = require('../doctors/doctor.service');
const clinicService = require('../clinics/clinic.service');

const {
  DOCTOR_SPECIALIZATIONS,
} = require('../../constants/doctorSpecializations');

const {
  DASHBOARD_LIMITS,
  DASHBOARD_SECTION_TYPES,
} = require('../../constants/dashboard.constants');

const getDashboard = async ({
  userId,
  latitude,
  longitude,
}) => {
  const today =
    new Date().toISOString().split('T')[0];

 const promises = [];

if (userId) {
  promises.push(
    Appointment.find({
      patientId: userId,
      appointmentDate: {
        $gte: today,
      },
      status: 'BOOKED',
    })
      .populate(
        'doctorId',
        'name specialization profileImage averageRating totalReviews'
      )
      .populate(
        'clinicId',
        'name shortAddress thumbnailImage'
      )
      .sort({
        appointmentDate: 1,
        startTime: 1,
      })
      .limit(
        DASHBOARD_LIMITS.UPCOMING_APPOINTMENTS
      )
  );
}

promises.push(
  doctorService.getPopularDoctors(
    DASHBOARD_LIMITS.POPULAR_DOCTORS
  )
);

promises.push(
  doctorService.getNearbyDoctors(
    latitude,
    longitude,
    DASHBOARD_LIMITS.SEARCH_RADIUS_METERS
  )
);

promises.push(
  clinicService.getNearbyClinics(
    latitude,
    longitude,
    DASHBOARD_LIMITS.SEARCH_RADIUS_METERS
  )
);

const results = await Promise.all(promises);

let upcomingAppointments = [];
let popularDoctors;
let nearbyDoctors;
let nearbyClinics;

if (userId) {
  [
    upcomingAppointments,
    popularDoctors,
    nearbyDoctors,
    nearbyClinics,
  ] = results;
} else {
  [
    popularDoctors,
    nearbyDoctors,
    nearbyClinics,
  ] = results;
}

  return {
    sections: [
      {
        type:
          DASHBOARD_SECTION_TYPES.SPECIALIZATIONS,
        title: 'Browse by Specialization',
        items: DOCTOR_SPECIALIZATIONS,
      },

      {
        type:
          DASHBOARD_SECTION_TYPES.UPCOMING_APPOINTMENTS,
        title: 'Upcoming Appointments',
        items: upcomingAppointments,
      },

      {
        type:
          DASHBOARD_SECTION_TYPES.POPULAR_DOCTORS,
        title: 'Popular Doctors',
        items: popularDoctors,
      },

      {
        type:
          DASHBOARD_SECTION_TYPES.NEARBY_DOCTORS,
        title: 'Doctors Near You',
        items: nearbyDoctors,
      },

      {
        type:
          DASHBOARD_SECTION_TYPES.NEARBY_CLINICS,
        title: 'Clinics Near You',
        items: nearbyClinics,
      },
    ],
  };
};

module.exports = {
  getDashboard,
};