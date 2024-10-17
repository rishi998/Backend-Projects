const express=require('express');
const app=express();

const usermodel=require("./models/user");
const postmodel=require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",function(req,res){
  res.render("index");
})
app.get("/login",function(req,res){
  res.render("login");
})

app.post("/login",async (req,res)=>{
  let {email,password}=req.body;
  
  let user=await usermodel.findOne({email});
  
  if(!user) return res.status(500).send("Something Went Wrong");
  
  bcrypt.compare(password,user.password, function(err,result){
    if(result) res.status(200).send("you can login");
    else res.redirect("/login");
  })
})
app.post("/register",async (req,res)=>{
  let {email,password,username,name,age}=req.body;
  
  let user=await usermodel.findOne({email});
  
  if(user) return res.status(500).send("User Already Exists");
  
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password, salt, async(err, hash)=>{
      let user=await usermodel.create({
        username,
        email, 
        age,
        name,
        password:hash
      });
      
      let token = jwt.sign({email:email,userid:user._id},"shhhh");
      res.cookie("token",token);
      res.send("Registered");
    })
  })
})

app.get("/logout",function(req,res){
  res.cookie("token","");
  res.redirect("/login");
})

app.listen(3000);
