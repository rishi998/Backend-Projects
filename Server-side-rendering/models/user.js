// creating the conection with the database
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/testapp");

// creating schema for the database
const userschema=mongoose.Schema({
  image:String,
  email:String,
  name:String
})

// exporting the created schema
module.exports=mongoose.model('user',userschema);

