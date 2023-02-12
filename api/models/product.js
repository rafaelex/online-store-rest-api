const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  stock: { type: Number, required: true },
  productImage: { type: String, required: true },
  status: String,
  createdDate: Date,
  updatedDate: Date,
});

module.exports = mongoose.model("Product", productSchema);
