const ErrorHandler = require('../utils/errorhandler');
module.exports=(err,req,res,next)=>{
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong MONGODB ID ERROR
  if (err.name === "CastError") {
    const message = `Resource not found,Invalid :${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //Mongoose duplicate error when the same user tries to register again
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //if err.keyValue is { email: 'example@example.com' }, Object.keys(err.keyValue) would return ['email'].
    //This can be useful for dynamically constructing error messages based on the properties involved in the error.

    err = new ErrorHandler(message, 400); //It then replaces the original error object (err) with a new instance of an ErrorHandler
  }

  //Wrong EXPIRE ERROR
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web token is expired`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT ERROR
  if (err.name === "JsonWebTokenError") {
    const message = `JSON WEB token is invalid.try again`;
    err = new ErrorHandler(message, 400);
  }
  

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};