const express=require('express');
const app=express();

const usermodel=require("./models/user");
const postmodel=require("./models/posts");

app.get("/",function(req,res){
  res.send("hey");
})

app.get("/create",async function(req,res){
  let user=await usermodel.create({
    username:"karan",
    age:23,
    email:"rishi@gmail.com"
  });

  res.send(user);

})

app.get("/post/create",async function(req,res){
  let post=await postmodel.create({
    postdata:"hello everyone",
    user:"670d12d4c228df4ba73c027a"
  })

  let user=await usermodel.findOne({_id: "670d12d4c228df4ba73c027a"});
  user.posts.push(post._id);
  await user.save();
  res.send({post,user});

});
app.listen(3000);
