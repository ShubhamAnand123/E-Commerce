const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product=require("../models/productModel");
const User=require("../models/userModel");


// CREATE NEW ORDER
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  // Your logic for creating a new order goes here
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("order not found thhis id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get LOGGED IN USER ORDER order
exports.myOrders = catchAsyncErrors(async (req, res, next) => {

  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

//GET ALL ORDERS
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();
    let amount=0;
    orders.forEach((order)=>{
        amount+=order.totalPrice;
    });
    res.status(200).json({
        success:true,
        orders,
    })
})

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
 if (!order) {
   return next(new ErrorHandler("Order not found for this id", 404));
 }
  // Update stock for each order item
  for (const ord of order.orderItems) {
    await updateStock(ord.product, ord.quantity);
  }

  // Update order status
  order.paymentInfo.orderStatus = req.body.status;

  // If status is "Delivered", record delivery timestamp
  if (req.body.status === "Delivered") {
    order.paymentInfo.deliveredAt = Date.now(); // Corrected field name to `deliveredAt`
  }
  

  // Save the updated order
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}


exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order= await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found for this id", 404));
  }

  await order.deleteOne() ;
    res.status(200).json({
      success: true,
    });
  });
