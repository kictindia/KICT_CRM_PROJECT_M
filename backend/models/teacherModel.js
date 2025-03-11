const mongoose = require("mongoose");

const teacherModel = new mongoose.Schema({
    TeacherID: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    FranchiseId:{
        type:String,
        required:true
    },
    FranchiseName:{
        type:String,
        required:true
    },
    Image: {
        type: String
    },
    Gender:{
        type:String,
        required:true
    },
    DOB:{
        type:String,
        required:true
    },
    DOJ:{
        type:String,
        required:true
    },
    Email: {
        type: String,
        required: true
    },
    MobileNo: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Salary:{
        type:Number,
        required:true
    },
    Role:[String]
});

const Teacher = mongoose.model("Teacher", teacherModel);
module.exports = Teacher;