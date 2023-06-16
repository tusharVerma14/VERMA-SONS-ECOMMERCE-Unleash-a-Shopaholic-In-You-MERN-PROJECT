const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        minLength: [4, "Name must contain atleast 4 character"],
        maxLength: [30, "Name cannot exceed 30 character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Paasword"],
        minLength: [4, "Password must contain atleast 4 character"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true

        },
        url: {
            type: String,
            required: true

        }
    },
    // for storing who hjas created a product which we will fetch from while login user we will store its id in our user below

    role: {
        type: String,
        default: "user",

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})
userSchema.pre('save', async function (next) {
    // while Upadate Profile->No password change occur Change Password->will chamge password
    // if condition is mentioned to avoid double hashing while update profile
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})
// JWT TOKEN
// usreschema k methods are all applicable to all users created
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPIRE
    })

}
//compare password between entered password amnd db saved password
userSchema.methods.comparePassword = async function (enteredPasword) {
    // bcrypt.compare(req.bopdy ka passwrod,hashed password(from db))
    return await bcrypt.compare(enteredPasword, this.password);
}
// Generating Reset Password token i.e generating link on whuich user can reset hi/her password
userSchema.methods.getResetPasswordToken = function () {
    // generating token(basically a random set of chararcters)
    const resetToken = crypto.randomBytes(20).toString('hex')// 20caharcter to not get in form of buffer format have used toString('hex') we we make toString emopty it will show i  form of some unwanted form
    console.log('reset token is ' + resetToken);
    this.resetPasswordToken = crypto
        .createHash('sha256')// sha256 is an algorithm name
        .update(resetToken)// generate hased form of resetToken
        .digest('hex')// same not to get in buffer format
    console.log('from getresetPaswordToken side hashed password token' + this.resetPasswordToken);

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // for 15 minutes

    // This resetToken will be used in by Nodemailer to send mail(in a link)
    return resetToken;

}
module.exports = mongoose.model('User', userSchema);