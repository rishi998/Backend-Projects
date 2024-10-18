const express=require('express');
const app=express();

const usermodel=require("./models/user");
const postmodel=require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const user = require('./models/user');
const post = require('./models/post');

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

app.get("/profile",isloggedin,async function(req,res){
  let user=await usermodel.findOne({email:req.user.email}).populate("posts");
  res.render("profile",{user});
})
app.get("/like/:id",isloggedin,async function(req,res){
  let post=await postmodel.findOne({_id:req.params.id}).populate("user");
  if(post.likes.indexOf(req.user.userid)===-1){
    post.likes.push(req.user.userid);
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid),1);
  }
  await post.save();
  res.redirect("/profile");
})

app.get("/edit/:id",isloggedin,async function(req,res){
  let post=await postmodel.findOne({_id:req.params.id}).populate("user");
  res.render("edit",{post});
})
app.get("/delete/:id",isloggedin,async function(req,res){
  await postmodel.findOneAndDelete({_id:req.params.id});
  res.redirect("/profile");
})
app.post("/update/:id",isloggedin,async function(req,res){
  let post=await postmodel.findOneAndUpdate({_id:req.params.id},{content:req.body.content});
  res.redirect("/profile");
})

app.post("/post",isloggedin,async function(req,res){
  let user=await usermodel.findOne({email:req.user.email});
  let {content}=req.body;
  let post=await postmodel.create({
    user:user._id,
    content
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
})

app.post("/login",async (req,res)=>{
  let {email,password}=req.body;
  
  let user=await usermodel.findOne({email});
  
  if(!user) return res.status(500).send("Something Went Wrong");
  
  bcrypt.compare(password,user.password, function(err,result){
    if(result){
      let token = jwt.sign({email:email,userid:user._id},"shhhh");
      res.cookie("token",token);
      res.status(200).redirect("/profile");
    } 
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
      res.redirect("/profile")
    })
  })
})

app.get("/logout",function(req,res){
  res.cookie("token","");
  res.redirect("/login");
})

function isloggedin(req,res,next){
  if(req.cookies.token==="") res.redirect("/login");
  else {
    let data=jwt.verify(req.cookies.token,"shhhh");
    req.user=data;
    next();
  }
}
app.listen(3000);
