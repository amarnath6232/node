const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const encrpt = require('./encryption');

const UserDetails = require("../models/UserDetails");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// sign up
router.post("/signup", (req, res, next) => {
  console.log("signup", req.body);
  const hash = encrpt.encryption(req.body.password);
  console.log(hash);
  const userDetails = new UserDetails({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    password: hash,
    confirmPassword: req.body.confirmPassword,
    phoneNumber: req.body.phoneNumber,
    dob: req.body.dob
  });
  UserDetails.collection.insertOne(userDetails, (error, result) => {
    if (error) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).json({
        message: userDetails.email + "User created successfully",
        user: result.ops
      });
    }
  })
});

// sign in
router.post("/signin", (req, res, next) => {
  console.log("sign in", req.body);
  UserDetails.findOne({
      email: req.body.email
    }, {})
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        const hash = encrpt.encryption(req.body.password);
        if (doc.password == hash) {
          const token = encrpt.jwtMethod(req.body.email)
          console.log(req.body.email + " login successfull");
          res.status(200).json({
            token: token
          });
        } else {
          console.log("invalid pwd");
          res.status(403).json({
            message: "Invalid email or password"
          })
        }
      } else {
        res
          .status(403)
          .json({
            message: "Invalid email or password"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Verify Email
router.post("/signin/email", (req, res, next) => {
  console.log("sign in", req.body);
  UserDetails.findOne({
      email: req.body.email
    }, {
      email: 1,
      _id: 0
    })
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(501).json({
          message: "Email existed"
        });
      } else {
        res
          .status(200)
          .json({
            message: "Email not existed"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  UserDetails.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for provided ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;