const mongoose = require('mongoose')


 const db_connection = mongoose.connect('mongodb://127.0.0.1:27017/authApi')
 .then(()=>{
     console.log('Db Connection Successfull')
 })
 .catch((err)=>console.log(err))

 module.exports = db_connection