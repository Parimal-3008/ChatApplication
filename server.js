const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static("public"));
app.set("view engine", "ejs");
let userstatus = false;
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
let username = "";
http.listen(3000, function () {
  console.log("server started on 3000");
});

const fileP = path.join(__dirname + "/public");
app.get("/chat", function (req, res) {
  if (userstatus == true) {
    console.log(userstatus);
    userstatus = false;
    res.render("chats");
  } else res.render("login");
  function toSearch() {
    res.render("search");
  }
});
app.get("/login", function (req, res) {
  res.render("login.html");
});
app.get("/register",function(req,res){
  res.render("register");
});

const schema = new mongoose.Schema({
  username: String,
  password: String,
  request_recieved: [{ type: String }],
  friends: [
    {
      username: String,
      roomid: String,
      msg: [{ send_recieved: String, DateTime: String, content: String }],
    },
  ],
});
const f1 = mongoose.model("account", schema);
mongoose.connect("mongodb://localhost/ChatApplication", {
  useNewUrlParser: true,
});

const MongoClient = require("mongodb");
const url = "mongodb://localhost:27017/";
const databasename = "ChatApplication"; // Database name

app.post("/register", function (req, res) {
  const f2 = new f1({
    username: req.body.n1,
    password: req.body.n3,
    request_recieved: [],
    friends: [],
  });
  f2.save();
});
app.post("/login", function (req, res) {
  f1.findOne({ username: req.body.n3 }, function (err, founduser) {
    console.log(err);
    if (err) console.log(err);
    else {
      if (founduser) {
        console.log(founduser);
        if (founduser.password === req.body.n4) {
          userstatus = true;
          username = founduser.username;
          res.redirect("/chat");
          console.log("Login successfull");
        } else console.log("Incorrect password");
      } else console.log("Invalid username");
    }
  });
});
app.get("/searchforuser", function (req, res) {
  console.log(username);
  res.render("search", { name: null, found: false, first: true });
});

app.post("/searchforuser", function (req, res) {
  var find = req.body.n1;

  f1.findOne({ username: find }, function (err, founduser) {
    if (err) console.log(err);
    else {
      if (founduser) {
        console.log("user found");
        res.render("search", { found: true, name: find, first: false });
      } else {
        // res.sendFile(path.join(fileP, "/search_user.html"),{status : false, first :false });
        console.log("no such user exist");
        res.render("search", { found: false, name: null, first: false });
      }
    }
  });
});

app.post("/sendrequest", function (req, res) {
  console.log(req.body);
  f1.findOne({ username: req.body.rec }, function (err, founduser) {
    if(founduser)
    {
      let b = false;
      console.log(founduser);
      for (i in founduser.request_recieved) {
        if (i == req.body.sen)
          b = true;
      }
        if (b == false) {
      f1.findOneAndUpdate({ username: req.body.rec }, { $push: { request_recieved: req.body.sen } }, { safe: true, upsert: true },
        function (err, doc) {
          if (err) {
            console.log(err);
          } else {
          }
        });
    }
    }
   });
});

app.post("/request_received",   function(req,res){
  let v= req.body.user;
  let arr= [];
  console.log(v);
   f1.findOne({username: v },async function(err, founduser){
     console.log(founduser);
     arr = await founduser.request_recieved;
     
     
     
    //  console.log(founduser.request_recieved);
  });
  res.render("request_received",{arr2: arr});
  
});