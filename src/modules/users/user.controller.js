const userService = require("./user.service");

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const {
      name,
      gender,
      age,
      bloodGroup,
      mobileNumber,
      address,
    } = req.body;

    const user =
      await userService.updateProfile(userId, {
        name,
        gender,
        age,
        bloodGroup,
        mobileNumber,
        address,
      });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const user =
      await userService.getProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  getProfile,
};