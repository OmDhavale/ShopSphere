import mongoose,{ Schema } from "mongoose";
//User fields: name, userID, password, usertype(customer or admin),email
const userSchema = new mongoose.Schema({

    email: {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        minLength : 10
    },
    
    password: {
        type : String,
        required : true
    }

},{timestamps : true, versionKey : false})

const userModel = mongoose.models.users || mongoose.model("users",userSchema); //user collection of userSchema type
export default userModel;
