const express=require('express');
const app=express();
const path=require('path');
const usermodel=require('./models/user');

// the default stuff for ejs files
// middlewares
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({entended:true}));
app.use(express.static(path.join(__dirname,'public')));

// the home route
app.get("/",(req,res)=>{
  res.render("index");
})
app.get('/read',async (req,res)=>{
  let users=await usermodel.find();
  res.render("read",{users});
})

app.post('/create',async (req,res)=>{
  let {name,email,image}=req.body;
  let createduser=await usermodel.create({
    name,
    email,
    image
  })
  res.redirect("/read");
})

app.get('/edit/:userid',async(req,res)=>{
  let user=await usermodel.findOne({_id:req.params.userid})
  res.render("edit",{user});
})

app.post('/update/:userid',async(req,res)=>{
  let {name,email,image}=req.body;
  let user=await usermodel.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true});
  res.redirect("/read");
})

app.get('/delete/:userid',async (req,res)=>{
  let users=await usermodel.findOneAndDelete({_id:req.params.userid})
  res.redirect("/read");
})

app.listen(3000);