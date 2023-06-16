const ErrorHandler = require("../utils/errorHandler");

// const ErrorHandler=require('../utils/errorHandler');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error !!";
    // Wrong Mongodb id error also called as cast error
    if (err.name === 'CastError') {
        const message = `Resource Not Found.Invalid :${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    // this 11000 error arises as duplicate key when user tries to register with same email(NOTE:statusCode and code is differnt)
    if (err.code === 11000) {
        const messsage = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(messsage, 400)
    }
    // (Wrong JWT error)Using Wrong Json web token on reset request on url
    if (err.name === 'JsonWebTokenError') {
        const messsage = `Json Web Token is Invalid,Try Again!!`
        err = new ErrorHandler(messsage, 400)
    }
    // JWT EXPIRE error
    if (err.name === 'TokenExpiredError') {
        const messsage = `Json Web Token is Expired,Try Again!!`
        err = new ErrorHandler(messsage, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        detailedmessage: err.stack
      
    });
};