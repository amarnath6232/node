const mongoose = require('mongoose');

const UserDetailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    designation: String,
    dob: String,
    email: String,
    password: String,
    confirmPassword: String,
    phoneNumber: Number,
});

module.exports = mongoose.model('UserDetails', UserDetailsSchema);