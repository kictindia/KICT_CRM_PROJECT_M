const mongoose = require("mongoose");

const studentAttendanceModel = new mongoose.Schema({
    Date: {
        type: String,
        required: true
    },
    Course: {
        type: String
    },
    Batch: {
        Hour: { type: String, required: true },  // Store Hour as String
        Name: { type: String, required: true },  // Store Name as String
    },
    Attendance: [{
        StudentId: {
            type: String
        },
        Name: {
            type: String
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

const StudentAttendance = mongoose.model("StudentAttendance", studentAttendanceModel);
module.exports = StudentAttendance;
