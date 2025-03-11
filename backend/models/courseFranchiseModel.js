const mongoose = require("mongoose");

const courseFranchiseModel = new mongoose.Schema({
    FranchiseId: {
        type: String,
        required: true
    },
    FranchiseName: {
        type: String,
        required: true
    },
    CourseData: [{
        CourseId: {
            type: String,
            required: true
        },
        CourseName: {
            type: String,
            required: true
        },
        CourseDuration: {
            type: String,
            required: true
        },
        Price: {
            BaseFee: {
                type: Number,
                required: true
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
        }
    }]
});

const CourseFranchise = mongoose.model("CourseFranchise", courseFranchiseModel);
module.exports = CourseFranchise;