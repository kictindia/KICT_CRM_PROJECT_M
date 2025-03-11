const mongoose = require("mongoose");

const courseModel = new mongoose.Schema({
    CourseId: {
        type: String,
        required: true
    },
    Category:{
        type:String,
        required:true
    },
    CourseName: {
        type: String,
        required: true
    },
    CourseDescription: {
        type: String,
        required: true
    },
    CourseDuration: {
        type: String,
        required: true
    },
    Syllabus: [{
        Title: {
            type: String,
        },
        Topics: [String]
    }],
    Content: [{
        Title: {
            type: String,
        },
        Topics: [{
            TopicName: {
                type: String
            },
            VideoLink: {
                type: String
            }
        }]
    }],
    Price: {
        BaseFee: {
            type: Number
        },
        Plans: [{
            PlanName: {
                type: String,
            },
            TotalFee: {
                type: Number,
            },
            Installment: [Number]
        }]
    },
    FranchiseId:{
        type:String
    },
    State:{
        type:String
    },
});

const Course = mongoose.model("Course", courseModel);
module.exports = Course;