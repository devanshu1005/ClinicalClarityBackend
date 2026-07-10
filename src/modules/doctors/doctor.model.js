const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },

    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },

    qualification: {
      type: String,
      default: '',
      trim: true,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },

    profileImage: {
      type: String,
      default: '',
      trim: true,
    },

    bio: {
      type: String,
      default: '',
      trim: true,
    },

    clinicIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;