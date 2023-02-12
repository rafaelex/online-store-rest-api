const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        //409 Conflict - A 409 Conflict response status indicates that the current request has conflicted with the resource that is on the server.
        //Here it means that the user already exists
        console.log(user);
        return res.status(409).json({
          message: "Mail address already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              //We need to install bcrypt to encrypt the user password... command: npm install bcrypt --save
              email: req.body.email,
              password: hash,
              createdDate: new Date(),
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ Error: err });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length === 0) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed",
          });
        }
        if (result) {
          //Intall the jsonwebtoken to generate a token in order to send valid tokens when a user is authenticated.
          //command: npm install jsonwebtoken --save
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({
            message: "Authentication successful",
            token: token,
          });
        } else {
          return res.status(401).json({
            message: "Authentication failed",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err });
    });
};

exports.user_delete = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      User.deleteOne({ _id: req.params.userId })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "User deleted successfully",
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
