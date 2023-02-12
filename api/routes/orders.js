const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

router.get("/", checkAuth, OrdersController.order_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.orders_get_single_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
