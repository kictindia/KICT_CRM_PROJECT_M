const mongoose = require("mongoose");

const staffAttendanceModel = new mongoose.Schema({
    Date: {
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
    Attendance: [{
        TeacherId: {
            type: String
        },
        Name:{
            type:String
        },
        Status: {
            type: String
        },
        InTime: {
            type: String
        },
        OutTime: {
            type: String
        }
    }]
});

const StaffAttendance = mongoose.model("StaffAttendance", staffAttendanceModel);
module.exports = StaffAttendance;