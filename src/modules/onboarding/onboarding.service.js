const Onboarding = require('./onboarding.model');

const createOnboarding = async (payload) => {
  const onboarding = await Onboarding.create(payload);
  return onboarding;
};

// const getOnboardingByIndex = async (index) => {
//   const onboarding = await Onboarding.findOne({ index });
//   return onboarding;
// };

const getAllOnboarding = async () => {
  const onboardingItems = await Onboarding.find({}).sort({ index: 1 });
  return onboardingItems;
};

module.exports = {
  createOnboarding,
  // getOnboardingByIndex,
  getAllOnboarding,
};