const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import the User model

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  console.log("try to auhtenticate suer");
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return next(new ErrorHandler("please login to access this resource"));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  console.log("try to auhtenticate role");
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user ? req.user.role : "unknown"} is not allowed`,
          403
        )
      );
    }
    next();
  };
};
