const express = require("express");
const app = express();
//Used to log the requests
const morgan = require("morgan");
const bodyParser = require("body-parser");

//MongoDB connection
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://rafaelex:${process.env.MONGO_ATLAS_PW}@online-store-rest-api.xfh7svc.mongodb.net/?retryWrites=true&w=majority`
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
//Making a folder static and public available;
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

//CORS: Cross-Origin Resouce Sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return;
    res.status(200).json({});
  }
  next();
});

//ROUTS THAT MUST HANDLE REQUESTS
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

//Middleware to handle errors
app.use((req, res, next) => {
  const error = Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
