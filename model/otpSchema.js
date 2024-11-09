const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email :{
        type : String,
        sparse: true,
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,  // Allows phone number to be optional but unique
    },
    password :{
        type : String
    },
    otp :{
        type :String,
        required : true
    },
    expiresAt: {
        type: Date,
        required: true,
      },
    createdAt :{
        type : Date,
        default : Date.now,
        expires :60*3
    }

})


module.exports = mongoose.model('Otp', otpSchema)