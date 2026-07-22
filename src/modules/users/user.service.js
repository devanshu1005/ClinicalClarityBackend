const User = require("./user.model");

const updateProfile = async (
  userId,
  payload
) => {
  const updateData = {};

  Object.keys(payload).forEach((key) => {
    if (
      payload[key] !== undefined &&
      payload[key] !== null
    ) {
      updateData[key] = payload[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select("-__v");

  return user;
};

const getProfile = async (userId) => {
  return User.findById(userId)
    .select("-__v")
    .lean();
};


module.exports = {
  updateProfile,
  getProfile,
};