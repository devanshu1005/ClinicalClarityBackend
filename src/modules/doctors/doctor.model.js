const mongoose = require('mongoose');
const {
  DOCTOR_SPECIALIZATIONS,
} = require('../../constants/doctorSpecializations');
const {
  DOCTOR_LANGUAGES,
} = require('../../constants/doctorLanguages');

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
      enum: {
        values: DOCTOR_SPECIALIZATIONS,
        message: '{VALUE} is not a valid specialization',
      },
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

    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
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

    languages: [
      {
        type: String,
        enum: DOCTOR_LANGUAGES,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    clinics: [
      {
        clinicId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Clinic',
          required: true,
        },

        availability: {
          workingDays: [
            {
              type: String,
              enum: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ],
            },
          ],

          startTime: {
            type: String,
            required: true,
          },

          endTime: {
            type: String,
            required: true,
          },

          slotDuration: {
            type: Number,
            required: true,
          },
        },
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