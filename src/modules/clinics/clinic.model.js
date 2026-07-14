const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },

    shortAddress: {
      type: String,
      required: [true, 'Short address is required'],
      trim: true,
    },

    fullAddress: {
      type: String,
      required: [true, 'Full address is required'],
      trim: true,
    },

    city: {
      type: String,
      trim: true,
      default: '',
    },

    state: {
      type: String,
      trim: true,
      default: '',
    },

    postalCode: {
      type: String,
      trim: true,
      default: '',
    },

    country: {
      type: String,
      trim: true,
      default: '',
    },

    thumbnailImage: {
      type: String,
      required: [true, 'Thumbnail image is required'],
      trim: true,
    },

    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
      trim: true,
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    doctorCount: {
      type: Number,
      default: 0,
      min: [0, 'Doctor count cannot be negative'],
    },

    doctorPreviewImages: {
      type: [String],
      default: [],
    },

    infoCard: {
      title: {
        type: String,
        default: '',
        trim: true,
      },
      subtitle: {
        type: String,
        default: '',
        trim: true,
      },
      icon: {
        type: String,
        default: '',
        trim: true,
      },
    },

    ctaLabel: {
      type: String,
      default: 'Get Directions',
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

clinicSchema.index({
  location: '2dsphere',
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;