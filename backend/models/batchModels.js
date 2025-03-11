const mongoose = require("mongoose");

const batchModel = new mongoose.Schema({
    FranchiseId: {
        type: String,
        required: true
    },
    FranchiseName:{
        type:String,
        required:true
    },
    Batch:[{
        Hour: {
            type: String,
            required: true
        },
        Slots: [{
            SlotTime: {
                type: String
            },
            Students: [{
                StudentId: {
                    type: String
                },
                StudentName: {
                    type: String
                },
            }]
        }]
    }]
});

const Batch = mongoose.model("Batch", batchModel);
module.exports = Batch;