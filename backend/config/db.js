const mongoose = require("mongoose");

const Database_URL = "mongodb+srv://root:root@cluster0.ca2cg9i.mongodb.net/Blossobit?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(Database_URL).then(()=>console.log('!!MongoDB Connected!!')).catch((err)=> console.log(err.message));
