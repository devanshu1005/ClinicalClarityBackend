const { z } = require('zod');

const createOnboardingSchema = z.object({
  body: z.object({
    onboardingImage: z.string().min(1, 'Onboarding image is required'),
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    isComingSoon: z.boolean().optional(),
    index: z.number({
      required_error: 'Index is required',
      invalid_type_error: 'Index must be a number',
    }),
  }),
});

const getOnboardingByIndexSchema = z.object({
  query: z.object({
    index: z.coerce.number({
      required_error: 'Index is required',
      invalid_type_error: 'Index must be a number',
    }),
  }),
});

module.exports = {
  createOnboardingSchema,
  getOnboardingByIndexSchema,
};