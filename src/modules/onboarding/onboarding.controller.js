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

const getAllOnboarding = async (req, res, next) => {
  try {
    const onboardingItems = await onboardingService.getAllOnboarding();

    return res.status(200).json({
      success: true,
      message: 'Onboarding data fetched successfully',
      count: onboardingItems.length,
      data: onboardingItems,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOnboarding,
  getAllOnboarding,
};