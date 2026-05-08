const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TransactionSchema = new mongoose.Schema({
  referenceNumber: { type: String, required: true },
  type: { type: String, enum: ["Debit", "Credit"], required: true },
  upiId: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    upiId: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    pin: {
      type: String,
      required: [true, "PIN is required"],
    },
    amount: {
      type: Number,
      default: 10000,
      min: [0, "Balance cannot be negative"],
    },
    budget: {
      type: Number,
      default: 0,
    },
    expenses: {
      type: Number,
      default: 0,
    },
    transactions: [TransactionSchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash PIN before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(12);
  this.pin = await bcrypt.hash(this.pin.toString(), salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare PIN
userSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin.toString(), this.pin);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.pin;
  return user;
};

module.exports = mongoose.model("userDatas", userSchema);
