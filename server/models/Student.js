const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    aadhaar:{
        type:String,
        required:true,
        unique:true
    },

    profileImage:{
        type:String,
        default:""
    },

    role:{
        type:String,
        default:"student"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Student",studentSchema);