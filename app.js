const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password: String
});

const secret = "thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});

var message = "Hii";
const User = new mongoose.model("user", userSchema);

app.get("/", function(req,res) {
    res.render("home");
})
app.get("/login", function(req,res) {
    res.render("login", {message:message});
})
app.get("/register", function(req,res) {
    res.render("register");
})
app.post("/register", function(req,res) {
    email = req.body.email;
    password = req.body.pass;
    User.findOne({email:email}, function(err,foundResult) {
        if(err) {
            console.log(err);
        }
        else {
            if(foundResult) {
                message = "Yoy have already Registered Please Login To continue...";
                res.redirect("login");
            }
            else{
                const newUser = new User({
                    email: email,
                    password: password
                });
                newUser.save(function(err) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        res.render("secrets");
                    }
                });
            }
        }
    })
    
})
app.post("/login", function(req,res) {
    const email = req.body.email;
    const pass = req.body.pass;
    User.findOne({email:email}, function(err, userFound) {
        if(err) {
            console.log(err);
        }
        else {
            if(userFound) {
                if(userFound.password === pass) {
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})
