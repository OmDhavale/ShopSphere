/**
 * 1. Category Name
 * 2. Description
 */
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
        required : true
    },
    description : {
        type : String,
        required : true,
        unique : true
    },
    image : {String}
},{timestamps: true, versionKey:false})

module.exports = mongoose.model("category",categorySchema)