const Order = require("../models/order");
const Product = require("../models/product");
const { default: mongoose } = require("mongoose");

exports.order_get_all = (req, res, next) => {
  Order.find()
    .select("_id product quantity status createdDate updatedDate")
    .populate("product", "name description price discountPercentage stock")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: "https://rest-api-online-shop.onrender.com/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
        status: "Order",
        createdDate: new Date(),
      });

      order
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Created order successfully",
            CreatedOrder: {
              ...result._doc,
              request: {
                type: "GET",
                url: "https://rest-api-online-shop.onrender.com/orders/" + result._id,
              },
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ Error: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
};

exports.orders_get_single_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "https://rest-api-online-shop.onrender.com/orders",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Order deleted successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            Error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: err,
      });
    });
};
