const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,  // This allows for an optional unique field
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,  // Allows phone number to be optional but unique
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : "user"
    }

})


module.exports = mongoose.model('User', userSchema)


