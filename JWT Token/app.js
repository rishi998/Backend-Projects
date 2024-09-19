const express=require('express');
const app=express();

const bcrypt=require('bcrypt');
const usermodel=require('./models/user')
const cookieparser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const path=require('path');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieparser());

app.get("/",(req,res)=>{
  res.render("index");
});

app.post("/create",(req,res)=>{
  let {username,email,password,age}=req.body;

  // hashing a password
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
      let createduser=await usermodel.create({
        username,
        email,
        password:hash,
        age
      })
      res.send(createduser);
    })
  })
  
  
})

app.get("/login",(req,res)=>{
  res.render("login");
})
app.post("/login",async (req,res)=>{
  let user=await usermodel.findOne({email:req.body.email});
  if(!user) return res.send("something went wrong");
  
  bcrypt.compare(req.body.password,user.password,function(err,result){
    if(result){
      res.cookie("token",token);
      res.send("You are logged in");
      let token = jwt.sign({email},"shhhhhhhhh");
    }
    else res.send("Something went wrong");
  });
})

app.get("/logout",(req,res)=>{
  res.cookie("token","");
  res.redirect("/");
})
app.listen(3000);
