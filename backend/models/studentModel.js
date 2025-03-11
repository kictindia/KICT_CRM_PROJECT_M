const mongoose = require("mongoose");

const studentModel = new mongoose.Schema({
    StudentID: {
        type: String,
        required: true,
        unique: true
    },
    RegistrationNumber: {
        type: String,
        required: true
    },
    AadhaarNumber: {
        type: String,
        required: true
    },
    DateofAdmission: {
        type: String,
        required: true
    },
    FranchiseId:{
        type:String,
        required:true
    },
    Branch: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    MobileNo: {
        type: String,
        required: true
    },
    AlterMobileNo: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Pincode: {
        type: String,
        required: true
    },
    Area: {
        type: String,
        required: true
    },
    Qualification: {
        type: String,
        required: true
    },
    GuardianDetails: [{
        GName: {
            type: String,
            required: true
        },
        GMobileNo: {
            type: String,
            required: true
        },
        GOccupation: {
            type: String,
            required: true
        }
    }],
    Course: [{
        CourseId: {
            type: String,
            required: true
        },
        CourseName: {
            type: String
        },
        CourseDuration: {
            type: String,
            required: true
        },
        Fee: {
            type: String,
            required: true
        },
        FeeMode: {
            type: String
        },
        Hour: {
            type: String,
            required: true
        },
        Slot: {
            type: String,
            required: true
        },
        Discount:{
            type: Number,
            default:0,
        },
        Additional:{
            type: Number,
            default:0,
        }
    }]
});

const Student = mongoose.model("Student", studentModel);
module.exports = Student;