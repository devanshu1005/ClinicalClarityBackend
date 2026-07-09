const Onboarding = require('./onboarding.model');

const createOnboarding = async (payload) => {
  const onboarding = await Onboarding.create(payload);
  return onboarding;
};

const getOnboardingByIndex = async (index) => {
  const onboarding = await Onboarding.findOne({ index });
  return onboarding;
};

module.exports = {
  createOnboarding,
  getOnboardingByIndex,
};