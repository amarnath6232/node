const express = require("express");
const router = express.Router();
const jwtToken = require('../auth/jwtToken');

const UserDetails = require("../models/UserDetails");

var userController = require('../controller/users.controller');

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
router.post("/signup", userController.createUser);

// refresh Token
router.get("/refreshToken/:email", (req, res, next) => {
  console.log("/refreshToken/:email", req.params.email);
  if (req.params.email) {
    const token = jwtToken.jwtMethod(req.params.email);
    console.log(token);
    res.status(200).json({
      token: token
    });
  } else {
    console.log(err);
    res.status(500).json({
      message: "No email is provided for refesh token."
    });
  }
});

// sign in
router.post("/signin", userController.loginUser);

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