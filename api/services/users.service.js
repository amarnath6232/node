// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/UserDetails');
var pswdEncryption = require('../routes/encryption');
const jwtToken = require('../auth/jwtToken');

// Saving the context of this module inside the _this variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        var Users = await User.find(query);
        // Return the Userd list that was retured by the mongoose promise
        return Users;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Users');
    }
}

exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    console.log("user", user);
    const hased = pswdEncryption.pwdEncryption(user.password);
    user.password = hased;
    try {
        // Saving the User
        var savedUser = await User.collection.insertOne(user);
        return savedUser;
    } catch (e) {
        // return a Error message describing the reason    
        console.log("e service", e);
        throw Error("Error while Creating User");
    }
}

exports.updateUser = async function (user) {
    var id = user._id
    // console.log("id",id);
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findByIdAndUpdate(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    //Edit the User Object
    oldUser.name = user.name
    oldUser.designation = user.designation
    oldUser.dob = user.dob
    oldUser.email = user.email
    oldUser.phoneNumber = user.phoneNumber
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {

    // Delete the User
    try {
        var deleted = await User.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}

exports.loginUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    console.log("user service", user);
    try {
        // Find the User 
        console.log("user service try", user);
        const doc = await User.findOne({
            email: user.email
        }, {
            email: 1,
            password: 1
        });
        if (doc) {
            const hash = pswdEncryption.pwdEncryption(user.password);
            if (doc.password === hash) {
                var token = jwtToken.jwtMethod(user.email);
            } else {
                throw Error("Invalid Password");
            }
        } else {
            throw Error("Error while Login");
        }
        return token;
    } catch (e) {
        // return a Error message describing the reason
        console.log("ers", e);
        throw Error(e);
    }

}