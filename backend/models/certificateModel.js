const mongoose = require("mongoose");

const certificateModel = new mongoose.Schema({
    CertificateId: {
        type: String,
        required: true,
        unique: true
    },
    StudentId: {
        type: String,
        required: true
    },
    CourseId: {
        type: String,
        required: true
    },
    FranchiseId:{
        type:String,
        required:true
    },
    Marks:[{
        topic:{
            type:String
        },
        totalMark:{
            type:Number
        },
        obtainedTheoryMark:{
            type:Number
        },
        obtainedPracticalMark:{
            type:Number
        },
        grade:{
            type:String
        }
    }],
    Percentage:{
        type:Number
    },
    Grade:{
        type:String
    },
    AdminVerified:{
        type:Boolean  
    },
    Date:{
        type:String,
        required:true
    }
});

const Certificate = mongoose.model("Certificate", certificateModel);
module.exports = Certificate;