const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },

    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },

    // patientId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },

    appointmentDate: {
      type: String,
      required: true, // YYYY-MM-DD
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'BOOKED',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW'
      ],
      default: 'BOOKED',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({
  doctorId: 1,
  appointmentDate: 1,
  startTime: 1,
});

module.exports = mongoose.model(
  'Appointment',
  appointmentSchema
);