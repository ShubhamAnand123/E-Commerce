const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//Register uSER
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profilepic",
    },
  });
  sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password)
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );

  const user = await User.findOne({ email }).select("+password").exec();
  if (!user) return next(new ErrorHandler("Invalid email or password", 401)); // 401 for unauthorized

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password", 401));

  senendTok(user, 200, res);
});

//logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logGed out successfully",
  });
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user Not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  //req.protocol It typically returns the protocol used in the request (e.g., http or https).
  //req.get() is a method used in Express.js to retrieve the specified HTTP request header.
  //"host" is passed as an argument to req.get() to get the value of the "Host" header, which typically contains the hostname from the URL.
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If u have not requested this emailt then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
//RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Extract token from request parameters
  const token = req.params.token;
  console.log(token);

  // Create hash of the token
  const resetPasswordTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  //console.log("Token:", resetPasswordTokenHash);

  // Find user by reset password token and check if token is still valid
  const user = await User.findOneAndUpdate(
    { resetPasswordToken: token }, // Query criteria to find the user
    { resetPasswordToken: resetPasswordTokenHash }, // Update to set the new hashed token
    { new: true } // Options to return the updated user object
  );
  // console.log("User found:", user);

  // If user is not found, return error
  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or expired", 404)
    );
  }

  // Check if passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords don't match"), 400);
  }

  // Update user's password and clear reset token fields
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save updated user
  await user.save();

  // Send response with success message or token
  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
//UPDATE PASSWORD
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.user.id).select("+password");
  const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
  return next(new ErrorHandler("old password is incorrect",400));
  }
  if(req.body.newPassword !=req.body.confirmPassword)
  {
   return next(new ErrorHandler("password dont match"));
  }
  user.password=req.body.newPassword;
  await user.save();
   sendToken(user,200,res);
})
//UPDATE USER PROFILE INFORMATION
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData={
    name:req.body.name,
    email:req.body.email
  }
    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
      new:true,
      runValidators:true,
      useFindModify:false,
    });
res.status(200).json({
  success:true,

});
});

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user: user, // Corrected from users to user
  });
});

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
 
  res.status(200).json({
    success: true,
    users,
  });
});
//UPDATE USER ROLE--admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindModify: false,
  });
  res.status(200).json({
    success: true,

  });
});
//DELETE USER ROLE--admin
exports.deleteUserProfile = catchAsyncErrors(async (req, res, next) => {

 const user= await User.findById(req.params.id)
 //we will remove cloudinary later
 if(!user){
 return next(new ErrorHandler(`User does not exist with id :$${req.params.id}`));
 }
await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
