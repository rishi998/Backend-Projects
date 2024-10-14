const mongoose=require('mongoose');
// const { setTheUsername } = require('whatwg-url');

mongoose.connect("mongodb://127.0.0.1:27017/testingthedatabase");

const userschema=mongoose.Schema({
  username:String,
  email:String,
  age:Number,
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  ]
})

module.exports=mongoose.model('user',userschema);
