const dashboardService = require('./dashboard.service');

const getDashboard = async (
  req,
  res,
  next
) => {
  try {
    const { latitude, longitude } =
      req.query;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'latitude and longitude are required',
      });
    }

    const dashboard =
      await dashboardService.getDashboard({
        userId: req.user?.userId || null,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

    return res.status(200).json({
      success: true,
      message:
        'Dashboard fetched successfully',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};