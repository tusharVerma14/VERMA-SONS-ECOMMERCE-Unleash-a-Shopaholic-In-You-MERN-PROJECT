const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    //options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    const status = statusCode || 500; // this is written bcz on register cloudinary was throwing error of invalid status code
    res.status(status).cookie('token', token, options).json({
        success: true,
        user,
        token,
    })

}
module.exports = sendToken;