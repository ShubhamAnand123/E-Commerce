const bcryptjs = require("bcryptjs"); // Change this line to use bcryptjs instead of bcrypt
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name should have a minimum of 4 letters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Minimum length of password should be 8 characters"],
    select: false, // Hide password field by default when querying the database
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Middleware to hash password before saving user to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Hash the password with bcryptjs
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

// Method to generate JWT token for user authentication
userSchema.methods.getJWTToken = function () {
  // Sign JWT token with user ID and secret key, set expiration time
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to generate and set reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token using crypto
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Set reset password token and expiry
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

// Method to compare password provided by user with hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  // Compare provided password with hashed password using bcryptjs
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
