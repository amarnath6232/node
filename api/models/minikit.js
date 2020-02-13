const mongoose = require('mongoose');

const minikitSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assessmentYear: String,
    fld: String,
    nameOfFarmer: String,
    village: String,
    season: String,
    documentoryEvidence: String
});

module.exports = mongoose.model('Minikit', minikitSchema);