const mongoose = require("mongoose");

const enquiryModel = new mongoose.Schema({
    EnquiryNo: {
        type: String,
        required: true,
        unique: true
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
    Course: {
        type: String,
        required: true
    },
    CourseId: {
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
    Qualification: {
        type: String,
        required: true
    },
    KnowAbout: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    PinCode:{
        type:String,
        required:true
    },
    Hour:{
        type:String,
        required:true
    },
    FeeMode:{
        type:String,
        required:true
    },
    BatchTime:{
        type:String,
        required:true
    },
    JoinDate:{
        type:String,
        required:true
    },
    Remark:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        default:"Open",
        required:true
    },
    Followup:{
        type:Number,
        default:0,
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
});

const Enquiry = mongoose.model("Enquiry", enquiryModel);
module.exports = Enquiry;