const express = require('express');
const { registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getAllUser, updateProfile, deleteProfile, updateUserRole } = require('../Controllers/userController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const { deleteProduct } = require('../Controllers/productControllers');
const userRouter = express.Router();

userRouter.route('/register').post(registerUser);

userRouter.route('/login').post(loginUser);

userRouter.route('/logout').get(logOut);

userRouter.route('/password/forgot').post(forgotPassword);

userRouter.route('/password/reset/:token').put(resetPassword)

userRouter.route('/me').get(isAuthenticatedUser, getUserDetails);

userRouter.route('/password/update').put(isAuthenticatedUser, updateUserPassword);

userRouter.route('/me/update').put(isAuthenticatedUser, updateUserProfile);

userRouter.route('/admin/users').get(isAuthenticatedUser,authorizedRoles('admin'),getAllUsers);
userRouter.route('/admin/user/:id').get(isAuthenticatedUser,authorizedRoles('admin'),getAllUser)
.put(isAuthenticatedUser,authorizedRoles('admin'),updateUserRole)
.delete(isAuthenticatedUser,authorizedRoles('admin'),deleteProfile);
module.exports = userRouter;