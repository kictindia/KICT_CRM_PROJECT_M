const mongoose = require("mongoose");

const loginModel = new mongoose.Schema({
    Id: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    }
});

const Login = mongoose.model("Login", loginModel);
module.exports = Login;