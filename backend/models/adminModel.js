const mongoose = require("mongoose");

const adminModel = new mongoose.Schema({
    AdminID: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    Image: {
        type: String
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    MobileNo: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model("Admin", adminModel);
module.exports = Admin;