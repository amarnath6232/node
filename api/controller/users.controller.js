var UserService = require('../services/users.service');
const UserDetails = require('../models/UserDetails');
const mongoose = require('mongoose');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({
            data: Users,
            message: "Succesfully Users Recieved"
        });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({
            status: 400,
            message: e.message
        });
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    const userDetails = new UserDetails({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        phoneNumber: req.body.phoneNumber,
        dob: req.body.dob
    });
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(userDetails);
        return res.status(201).json({
            data: createdUser.ops,
            message: "Succesfully Created User"
        })
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(501).json({
            message: "User Creation was Unsuccesfull",
            validation: user.message
        })
    }
}

// completed update user and tested
exports.updateUser = async function (req, res, next) {

    // console.log('update body', req.body);

    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(501).json({
            message: "Id must be present"
        })
    }

    var User = {
        _id: req.body._id,
        name: req.body.name ? req.body.name : null,
        designation: req.body.designation ? req.body.designation : null,
        dob: req.body.dob ? req.body.dob : null,
        email: req.body.email ? req.body.email : null,
        phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
    }

    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json({
            data: updatedUser,
            message: "Succesfully Updated User"
        })
    } catch (e) {
        return res.status(400).json({
            status: 400.,
            message: e.message
        })
    }
}

// completed delete operation and tested
exports.removeUser = async function (req, res, next) {
    const id = req.params.id;
    console.log("id", req.params.id);
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: e.message
        })
    }
}

// completed login and tested
exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    console.log("login controller", req.body);

    try {
        // Calling the Service function with the new object from the Request Body
        console.log("login controller try", req.body);
        var loginUser = await UserService.loginUser(User);
        return res.status(201).json({
            token: loginUser,
            message: "Succesfully login"
        });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e);
        return res.status(403).json({
            status: 403,
            message: "Invalid email or password"
        });
    }
}