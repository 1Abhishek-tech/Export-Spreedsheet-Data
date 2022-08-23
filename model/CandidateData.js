const mongoose = require('mongoose');

var CandidateDataSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    mobile: {
        type: String,
    },
    dob: {
        type: String,
    },
    work_experience: {
        type: String,
    },
    resume_title: {
        type: String,
    },
    current_location: {
        type: String,
    },
    postal_address: {
        type: String,
    },
    current_employer: {
        type: String,
    },
    current_designation: {
        type: String,
    }
}
);
module.exports = mongoose.model('CandidateData', CandidateDataSchema);

// -> Import Excel Data to MongoDB