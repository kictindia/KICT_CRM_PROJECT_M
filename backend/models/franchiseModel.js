const mongoose = require("mongoose");

const franchiseModel = new mongoose.Schema({
    FranchiseID: {
        type: String,
        required: true,
        unique: true
    },
    FranchiseName: {
        type: String,
        required: true
    },
    OwnerName: {
        type: String,
        required: true
    },
    UPIId: {
        type: String,
        required: true
    },
    UPICode: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    MobileNo: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Area:{
        type:String,
        required:true
    },
    Pincode: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    HeadOffice:{
        type:Boolean,
        required:true
    },
    OpenTime:{
        type:String,
        required:true
    },
    CloseTime:{
        type:String,
        required:true
    }
});

const Franchise = mongoose.model("Franchise", franchiseModel);
module.exports = Franchise;