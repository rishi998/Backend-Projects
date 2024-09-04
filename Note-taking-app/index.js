// a basic express app with routing functionalities between files and home page
// step 1: boiler plate from line 3 to 5
const express = require("express");
const app = express();
const path = require("path");

// step 2: requiring the fs library to work with files from line 8 and 9
const fs = require("fs");
const { log } = require("console");

// step 3: The view engine of express is set to work with ejs files ( basic html files with a capability of making changes dynamically)
app.set("view engine", "ejs");

// step 4: The express server cannot read the code written by the user so it is necessary to change them to json format and url format to a machine readable language and vice versa
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// step 5: allowing our express app to read the public static files like html, css, images and javascripts
app.use(express.static(path.join(__dirname, "public")));

// step 6: app.get defines a route(a new page on the web) on the server. we are giving router name as "/" representing the home route.
// Then we will create a folder named as files in the project directory. We will send index.ejs as a response and all the files inside the files folder
app.get("/", function (req, res) {
  fs.readdir("./files", function (err, files) {
    res.render("index", { files: files });
  });
});

// step 7: creating a new route for opening a file in a different page
app.get("/file/:filename", function (req, res) {
  // reading a new file in the files folder giving giving its name, utf-8 to change it to english language and a function to render it to the screen with filenaem and file data.
  fs.readFile(`./files/${req.params.filename}`,"utf-8",function (err, filedata) {
    res.render('show',{filename:req.params.filename, filedata:filedata});
  });
});

app.get("/edit/:filename", function (req, res) {
    res.render('edit',{filename:req.params.filename});
});

app.post("/edit", function (req, res) {
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
      res.redirect("/");
    })
});

// step 8: creating a  new file in the files folder
app.post("/create", function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
    // will redirect back to home page.
    res.redirect("/");
  })
});

// starting the server
app.listen(3000);
