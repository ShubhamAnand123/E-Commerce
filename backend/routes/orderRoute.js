const express=require("express");
const router=express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth"); // Adjust the path as needed
const { newOrder, getSingleOrder,myOrders, updateOrder,getAllOrders,deleteOrder} = require("../controllers/OrderController");
router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);
router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);

module.exports=router;
