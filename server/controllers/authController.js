const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../middleware/errorHandler");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password, phoneNo, pin } = req.body;

  // Validate required fields
  if (!userName || !fullName || !email || !password || !phoneNo || !pin) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (pin.toString().length !== 4 || isNaN(pin)) {
    return res.status(400).json({ message: "PIN must be exactly 4 digits" });
  }

  if (phoneNo.toString().length !== 10) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUser) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  const upiId = `${userName.toLowerCase()}@meshpay`;

  const user = await User.create({
    userName,
    fullName,
    email,
    password,
    phoneNo: phoneNo.toString(),
    pin: pin.toString(),
    amount: 10000,
    upiId,
  });

  res.status(201).json({
    message: "Registration successful",
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      upiId: user.upiId,
    },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = await User.findOne({ userName });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    token,
    user: user.toJSON(),
  });
});

/**
 * GET /api/auth/me
 * Protected — requires auth middleware
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

/**
 * POST /api/auth/verify-pin
 * Protected
 */
const verifyPin = asyncHandler(async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ message: "PIN is required" });
  }

  // Fetch full user with pin field
  const user = await User.findById(req.userId);

  if (!user || !(await user.matchPin(pin))) {
    return res.status(401).json({ message: "Invalid PIN" });
  }

  res.status(200).json({ message: "PIN verified" });
});

module.exports = { register, login, getMe, verifyPin };
