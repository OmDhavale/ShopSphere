const mongoose = require("mongoose");
//User fields: name, userID, password, usertype(customer or admin),email
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true
    },
    
    email: {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        minLength : 10
    },
    
    password : {
        type : String,
        required : true
    }

},{timestamps : true, versionKey : false})

module.exports = mongoose.model("User",userSchema); //user collection of userSchema type

