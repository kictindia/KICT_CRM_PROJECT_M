const mongoose = require("mongoose");

const followUpModel = new mongoose.Schema({
    EnquiryNo: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true
    },
    FranchiseId: {
        type: String,
        required: true
    },
    FranchiseName: {
        type: String,
        required: true
    },
    MobileNo: {
        type: String,
        required: true
    },
    AMobileNo: {
        type: String,
        required: true
    },
    Course:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    Time:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        required:true
    },
    Followup:{
        type:Number,
        default:0,
        required:true
    }
});

const FollowUp = mongoose.model("FollowUp", followUpModel);
module.exports = FollowUp;