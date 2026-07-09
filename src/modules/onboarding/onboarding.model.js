const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema(
  {
    onboardingImage: {
      type: String,
      required: [true, 'Onboarding image is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      required: [true, 'Index is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// onboardingSchema.index({ index: 1 }, { unique: true });

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

module.exports = Onboarding;