const mongoose = require('mongoose')

let UserData= new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    userName:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
   
})
module.exports = mongoose.model("userData", UserData)