const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Minikit = require("./../models/minikit");

const Authorization = require('../auth/authorization');
const userController = require('../controller/users.controller');

// Handle incoming GET requests to /Users
router.get('/', Authorization, userController.getUsers);

// update user
router.put('/update', Authorization, userController.updateUser);

/* user delete */
router.delete("/delete/:id", Authorization, userController.removeUser);

/* minikit */
router.post('/minikit', Authorization, (req, res, next) => {
    console.log("minikit", req.body);
    const minikit = new Minikit({
        _id: new mongoose.Types.ObjectId(),
        assessmentYear: req.body.assessmentYear,
        fld: req.body.fld,
        nameOfFarmer: req.body.nameOfFarmer,
        village: req.body.village,
        season: req.body.season,
        documentoryEvidence: req.body.documentoryEvidence
    });
    Minikit.collection.insertOne(minikit, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: "minikit created successfully",
                user: result.ops
            });
        }
    })
});

/* minikit get table list */
router.get('/minikit', Authorization, (req, res, next) => {
    Minikit.find()
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

// update minkit
router.put('/minikit/update', Authorization, (req, res, next) => {
    console.log('update body', req.body);
    const query = req.body;
    const userId = query._id;
    delete query['id'];

    Minikit.findByIdAndUpdate(userId, query, {
            new: true
        })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(204)
                    .json({
                        message: "No Content"
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

/* minikit delete */
router.delete("/minikit/delete/:id", Authorization, (req, res, next) => {
    const id = req.params.id;
    Minikit.remove({
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