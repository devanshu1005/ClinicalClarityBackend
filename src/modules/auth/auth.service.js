const jwt = require('jsonwebtoken');
const Otp = require('./auth.model');
const User = require('../users/user.model');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d',
    }
  );
};

const requestOtp = async ({ email }) => {
  if (!email) {
    throw new Error('Email is required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOtp();

  // delete old OTPs for this email
  await Otp.deleteMany({ email: normalizedEmail });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await Otp.create({
    email: normalizedEmail,
    otp,
    expiresAt,
  });

  // TODO: send email here
  console.log(`OTP for ${normalizedEmail}: ${otp}`);

  return {
    message: 'OTP sent successfully',
  };
};

const verifyOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await Otp.findOne({ email: normalizedEmail }).sort({
    createdAt: -1,
  });

  if (!otpRecord) {
    throw new Error('OTP not found. Please request a new OTP');
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error('OTP expired. Please request a new OTP');
  }

  if (otpRecord.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  // OTP verified → remove it
  await Otp.deleteMany({ email: normalizedEmail });

  let user = await User.findOne({ email: normalizedEmail });
  let isNewUser = false;

  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      isEmailVerified: true,
    });
    isNewUser = true;
  } else {
    user.lastLoginAt = new Date();
    await user.save();
  }

  const token = generateToken(user);

  return {
    token,
    isNewUser,
    user: {
      _id: user._id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      name: user.name,
      gender: user.gender,
      age: user.age,
      bloodGroup: user.bloodGroup,
      mobileNumber: user.mobileNumber,
      profileImage: user.profileImage,
      address: user.address,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

module.exports = {
  requestOtp,
  verifyOtp,
};