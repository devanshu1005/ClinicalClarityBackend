const authService = require('./auth.service');

const requestOtp = async (req, res, next) => {
  try {
    const result = await authService.requestOtp(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtp(req.body);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
};