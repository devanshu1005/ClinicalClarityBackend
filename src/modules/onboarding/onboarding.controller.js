const onboardingService = require('./onboarding.service');

const createOnboarding = async (req, res, next) => {
  try {
    const { onboardingImage, title, subtitle, isComingSoon, index } = req.body;

    if (
      !onboardingImage ||
      !title ||
      !subtitle ||
      index === undefined ||
      index === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          'onboardingImage, title, subtitle, and index are required fields',
      });
    }

    const existingOnboarding = await onboardingService.getOnboardingByIndex(
      Number(index)
    );

    if (existingOnboarding) {
      return res.status(409).json({
        success: false,
        message: `Onboarding data with index ${index} already exists`,
      });
    }

    const onboarding = await onboardingService.createOnboarding({
      onboardingImage,
      title,
      subtitle,
      isComingSoon: isComingSoon ?? false,
      index: Number(index),
    });

    return res.status(201).json({
      success: true,
      message: 'Onboarding data saved successfully',
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

const getOnboardingByIndex = async (req, res, next) => {
  try {
    const { index } = req.query;

    if (index === undefined || index === null || index === '') {
      return res.status(400).json({
        success: false,
        message: 'index query param is required',
      });
    }

    const onboarding = await onboardingService.getOnboardingByIndex(
      Number(index)
    );

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: `No onboarding data found for index ${index}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding data fetched successfully',
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOnboarding,
  getOnboardingByIndex,
};