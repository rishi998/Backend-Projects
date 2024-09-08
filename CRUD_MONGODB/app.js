const express = require('express');
const app = express();

const usermodel=require('./usermodel');

app.get("/", function (req, res) {
  res.send("hey there");
});

// user 1
app.get("/create", async (req, res)=>{
  let createduser=await usermodel.create({
    name:"rishi",
    username:"mehtorishi",
    email:'rishi@gmail.com'
  })
  res.send(createduser);
});

// user 2
app.get("/create", async (req, res)=>{
  let createduser=await usermodel.create({
    name:"aman",
    username:"mehtorishi",
    email:'aman@gmail.com'
  })
  res.send(createduser);
});

// user 3
app.get("/create", async (req, res)=>{
  let createduser=await usermodel.create({
    name:"mahesh",
    username:"mehtorishi",
    email:'mahesh@gmail.com'
  })
  res.send(createduser);
});

app.get("/update",async (req,res)=>{
  let updateduser=await usermodel.findOneAndUpdate({username:"mehtorishi"},{name:"Rishi singh"},{new:true});

  res.send(updateduser);
})

// read all
app.get("/read",async (req,res)=>{
  let users=await usermodel.find();
  res.send(users);
})

// read one
app.get("/read",async(req,res)=>{
  let user=await usermodel.find();
  res.send(user);
})

app.get("/delete",async (req,res)=>{
  let deleteduser=await usermodel.findOneAndDelete({name:"mahesh"});
  res.send(deleteduser);
})
app.listen(3000);
