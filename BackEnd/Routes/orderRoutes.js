const express = require('express');
const orderRouter = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const { newOrder, getMyOrderDetails, getSingleOrderDetails, getAllOrdersDetails, updateOrderDetails, deleteOrder } = require('../Controllers/orderController');

orderRouter.route('/order/new').post(isAuthenticatedUser, newOrder)
orderRouter.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);
orderRouter.route('/orders/me').get(isAuthenticatedUser, getMyOrderDetails);
orderRouter.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrdersDetails);
orderRouter.route('/admin/order/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateOrderDetails).delete(isAuthenticatedUser, authorizedRoles('admin'),deleteOrder)



    
module.exports = orderRouter