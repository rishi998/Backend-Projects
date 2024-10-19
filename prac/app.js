const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();

const usermodel=require('./models/user');
const postmodel=require('./models/post');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const user=require('./models/user');
const post=require('./models/post');

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.get("/",function(req,res){
  res.render("index");
})

app.get("/register",function(req,res){
  
})
app.get("/login",(req,res)=>{
  res.redirect("profile");
})
app.post("/login",(req,res)=>{
  let {email,password}=req.body;
  let user=usermodel.findOne({email});
  if(!user) return res.status(200).send("something went wrong");

  bcrypt.compare(password,user.password,(err,result)=>{
    if(result){
      let token=jwt.sign({email:email,userid:user._id},"shhhh");
      res.cookie("token",token);
      res.status(200).redirect("/profile");
    }
    else{
      res.redirect("/login");
    }
  })
})

app.get("/profile",async (req,res)=>{
  let user=await usermodel.findOne({email:req.user.email}).populate("posts");
  res.render("profile",{user});
})

app.get("/logout",(req,res)=>{
  res.cookie("token","");
  res.redirect("/login");
})
app.post("/register",async (req,res)=>{
  let {name,username,age,email,password}=req.body;
  let user=await usermodel.findOne({email});
  if(user) return res.status(500).send("User already exists");

  bcrypt.genSalt(10,(err,salt)=>[
    bcrypt.hash(password,salt,async(err,hash)=>{
      let user=await usermodel.create({
        username,
        name,
        age,
        email,
        password:hash
      })

      let token=jwt.sign({email:email,userid:user._id},"shhhh");
      res.cookie("token",token);
      res.redirect("/profile");
    })
  ])
})
app.listen(3000);