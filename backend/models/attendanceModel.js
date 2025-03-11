const mongoose = require("mongoose");

const attendanceModel = new mongoose.Schema({
    Date:{
        type:String,
        required:true
    },
    Time:{
        type:String,
        required:true
    },
    Franchise:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true
    },
    Batch:{
        type:String
    },
    Data:[{
        Id:{
            type:String,
            required:true
        },
        Name:{
            type:String,
            required:true
        },
        Status:{
            type:String,
            required:true
        },
        Topic:{
            type:String
        }
    }]
});

const Attendance = mongoose.model("Attendance", attendanceModel);
module.exports = Attendance;