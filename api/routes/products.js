const express = require("express");
const { response } = require("../../app");
const router = express.Router();
//For usiing forms that allow image upload...
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const productsController = require("../controllers/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //Reject or Accept a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //Only accept upload files up to 5 megabytes
  },
  fileFilter: fileFilter,
});

router.get("/", productsController.product_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productsController.product_create_product
);

router.get("/:productId", productsController.product_get_single_product);

/*
Difference Between PUT and PATCH Request

PUT HTTP Request: PUT is a method of modifying resources where the client sends data that updates the entire resource. 
PUT is similar to POST in that it can create resources, but it does so when there is a defined URL wherein PUT replaces the 
entire resource if it exists or creates new if it does not exist.

PATCH HTTP Request: Unlike PUT Request, PATCH does partial update e.g. Fields that need to be updated by the client, only that 
field is updated without modifying the other field.
*/
router.patch(
  "/:productId",
  checkAuth,
  upload.single("productImage"),
  productsController.product_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  productsController.product_delete_product
);

module.exports = router;
