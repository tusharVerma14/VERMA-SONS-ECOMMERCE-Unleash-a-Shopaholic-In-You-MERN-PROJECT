const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllReviews, deleteReview, getAdminProducts } = require('../Controllers/productControllers');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const productRouter = express.Router();
// isAuthenticate checks whther a user is login or not and authorizedRole checks wther the login user i admin or not
productRouter.route('/products')
    .get(getAllProducts)

productRouter.route('/admin/products').get(isAuthenticatedUser, authorizedRoles('admin'), getAdminProducts)

productRouter.route('/admin/product/new')
    .post(isAuthenticatedUser, authorizedRoles('admin'), createProduct)

productRouter.route('/admin/product/:id')
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct)
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct)

productRouter.route('/product/:id').get(getProductDetails)
productRouter.route('/product/review').put(isAuthenticatedUser, createProductReview)
productRouter.route('/reviews').get(getAllReviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = productRouter;