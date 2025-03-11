const mongoose = require("mongoose");

const salaryModel = new mongoose.Schema({
    
    TeacherId:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    FranchiseId:{
        type:String,
        required:true
    },
    Month:{
        type:String,
        required:true
    },
    Year:{
        type:String,
        required:true
    },
    Salary:{
        type:Number,
        required:true
    },
    PaidAmount:{
        type:Number,
        required:true,
        default:0
    },
    BaseSalary:{
        type:Number,
        required:true
    },
    PresentCount:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        required:true
    }
});

const Salary = mongoose.model("Salary", salaryModel);
module.exports = Salary;