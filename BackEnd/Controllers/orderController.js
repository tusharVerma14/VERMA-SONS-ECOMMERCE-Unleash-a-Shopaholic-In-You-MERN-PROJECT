const Order = require('../models/orderModels');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendMail')
const catchAsyncError = require('../middleware/catchAsyncError');
// //Create New Order i.e place an order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    /// destructuring
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(201).json({
        success: true,
        orderdetails: order
    })
})
// get single order details
exports.getSingleOrderDetails = catchAsyncError(async (req, res, next) => {


    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHandler('Order Not Found!!! ', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})
// Get My Order Details(only possible for logged in user)
exports.getMyOrderDetails = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})
// get all order details --admin
exports.getAllOrdersDetails = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        orderDetails: orders,
        totalAmountOfOrders: totalAmount
    })
})
// update order status --Admin
exports.updateOrderDetails = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order Not Found with This Id!!! ', 404))
    }


    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You Have already Delivered this Order', 400))
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (order) => {
            await updateStock(order.productId, order.quantity)
        })
    }

    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {

        order.deliveredAt = Date.now()
        const user=await User.findOne({_id:req.user._id})
        let isOutOfStock = false;

        let pId = [];
        const products = await Product.find();

        products.map((product) => {
            if (product.Stock <= 0) {
                isOutOfStock = true;

                const obj={productId:product["_id"],productName:product["name"]}
                pId.push(obj)


            }
        })

        if (isOutOfStock) {
            let msg=`Out Of Stock Products are as Follows: \n\n`;
            pId.map((item,index)=>{
                msg+=`${index+1} --> ${item.productName} \n${process.env.FRONTEND_URL}/admin/product/${item.productId} \n\n`
            })

            const messageInEmail = msg;
            try {

                await sendEmail({

                    email: user.email,
                    subject: 'Update Yours Stock',
                    messageInEmail
                })

                isOutOfStock = false;
            } catch (error) {



                return next(new ErrorHandler(error.message, 500))
            }
        }
    }
    await order.save({ validateBeforeSave: false })


 

    await order.save({ validateBeforeSave: false })


    res.status(200).json({
        success: true,

    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}
// delete order --Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order Not Found with This Id!!! ', 404))
    }



    res.status(200).json({
        success: true,

    })
})