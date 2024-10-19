const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pracbackend");

const postschema=mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  date:{
    type:Date,
    ref:"user"
  },
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  ]
});
module.exports=mongoose.model("post",postschema);