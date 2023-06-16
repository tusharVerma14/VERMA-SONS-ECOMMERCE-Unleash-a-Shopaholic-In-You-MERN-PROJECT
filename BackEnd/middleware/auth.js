const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require('jsonwebtoken')
exports.isAuthenticatedUser=catchAsyncError(async (req,res,next)=>{
   // written as {token} to not get as object built directly token
     const {token} =req.cookies;

     if(!token){
        return next(new ErrorHandler('Please Login To access This Resource',401))

    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRETKEY)

    // we are storing the data of user in req.user which will be used a lot in upcoming functionality
    req.user=await User.findById(decodedData.id)

    next();
})
// ...role is an array includes is a method of an array
exports.authorizedRoles=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource `,403))
    }
    next();
  };
};