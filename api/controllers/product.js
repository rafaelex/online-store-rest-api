const Product = require("../models/product");
const mongoose = require("mongoose");
//fs module is short for the file system, is used to work with the file system
const fs = require("fs");

exports.product_get_all = (req, res, next) => {
  Product.find()
    .select(
      "_id name description price discountPercentage stock productImage status createdDate updatedDate"
    )
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: "https://rest-api-online-shop.onrender.com/products/" + doc._id,
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

exports.product_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discountPercentage: req.body.discountPercentage,
    stock: req.body.stock,
    productImage: req.file.path,
    status: req.body.status,
    createdDate: new Date(),
    updatedDate: new Date(),
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created product successfully",
        Createdproduct: {
          ...result._doc,
          request: {
            type: "GET",
            url: "https://rest-api-online-shop.onrender.com/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.product_get_single_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select(
      "_id name description price discountPercentage stock productImage status createdDate updatedDate"
    )
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry was found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_update_product = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  const updateOptions = req.body;
  console.log(req.file);

  console.log("--------------------------------------");
  console.log(updateOptions);

  Product.findById(id)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      } else {
        if (req.file) {
          /*The unlinkSync() method will delete a file synchronously,
        which means JavaScript code execution will stop until the method finished running.
        The fs.unlink() method will delete a file in your filesystem asynchronously, 
        which means JavaScript code execution will continue without waiting for the method to finish.*/
          const path = "./" + updateOptions.productImage;
          try {
            fs.unlinkSync(path);
            console.log("File removed" + path);
          } catch (err) {
            console.log(err);
          }
        }
      }

      Product.updateOne({ _id: id }, { $set: updateOptions })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Updated product successfully",
            request: {
              tyep: "GET",
              url: "https://rest-api-online-shop.onrender.com/products/" + id,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
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

exports.product_delete_product = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
