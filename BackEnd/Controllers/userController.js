const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendMail')
const crypto = require('crypto');

const cloudinary = require('cloudinary')

exports.registerUser = catchAsyncError(async (req, res, next) => {


    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });


    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {

            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });


    sendToken(user, 201, res);


})

// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    // check if user has given emial and passwrod
    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email and Password', 400));
    }
    // find the data of user of given email id and retrieve password (as we have put some restriction on passwrod earlier in userSchema of select therefore we have to used this select('+passwrod') way to also select password )
    const user = await User.findOne({ email }).select('+password');
    if (!user) {

        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    // here we password:will contain unencrypted password and comparePassword will internally convert and compare to user encrypted password
    const isPasswordMatched = await user.comparePassword(password)


    if (!isPasswordMatched) {

        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    sendToken(user, 200, res);
})
exports.logOut = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        succes: true,
        message: 'Logged Out Succesfully!!'
    })
})
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) {
        return next(new ErrorHandler('User  Not Found', 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken(); // eventually this will call getResetPasswordToken() method and will generate token but this will not save in user db that token / hashed
    await user.save({ validateBeforeSave: false })// to save generated token in to db of user

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;// here we have used resetToken and this will be unique everytime when forgetPassword got clicked
    const messageInEmail = `Your password Link is as follows :-\n\n ${resetPasswordUrl}\n\n If You have not requested this email Knidly Ignore!!!`;
    try {

        await sendEmail({

            email: user.email,
            subject: 'Ecommerce Password Recovery',
            messageInEmail
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully!!!`
        })
    } catch (error) {
        // if any error occureed the first and foremost thing to do is as follows
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Reset Password Token is Invalid or Expired', 400));

    }
    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler('Password and Confirm Password Mismatched', 400));
    }
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendToken(user, 200, res)
})

// Get Users Details(own detail)
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    // console.log('password matched or not '+isPasswordMatched);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('OldPassword is Incorrect', 400))
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not matches', 400))

    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        userDetails: user
    })
})
// email,name,profle image update of user -- by itelf
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,

    }

    //    we will add cloudinary now we added in which we are firstly deleting earlier one(profile pic i.e AVATAR) and then uploading new one

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId); // destroying earlier one

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });// again uplaoding new one similar to that of what we have done in register

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,

    })
    res.status(200).json({
        success: true,

    })
})
//  get all user (--admin )
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.json({
        success: true,
        users
    })
})
// get a particular single User(--admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id :${req.params.id}`), 404)
    }
    res.json({
        success: true,
        // userDetails: user
        user
    })
})
// update user role( also email,name) --Admin

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});
// Delete user profile --Admin
exports.deleteProfile = catchAsyncError(async (req, res, next) => {

    //    we will remove from cloudinary
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id :${req.params.id}`), 404)
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId); // destroying earlier one

    res.status(200).json({
        success: true,
        message: 'User deleted Successfully!!!',
        userDetails: user
    })
})