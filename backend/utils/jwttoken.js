const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  if (!user || !user.getJWTToken || typeof user.getJWTToken !== "function") {
    return next(new ErrorHandler("Invalid user object", 500));
  }

  try {
    const token = user.getJWTToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // Add additional cookie security options if needed
    };

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      // Consider removing the 'user' field from the response
      // user: user,
      token: token,
    });
  } catch (error) {
    // Handle any errors that might occur during token generation or cookie setting
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

module.exports = sendToken;
