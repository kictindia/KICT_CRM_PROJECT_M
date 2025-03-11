const mongoose = require('mongoose');

const counterModel = new mongoose.Schema({
    Title: {
        type: String
    },
    Count: {
        type: Number
    }
});

const Counter = mongoose.model("Counter", counterModel);
module.exports = Counter;