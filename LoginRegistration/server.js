var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
//Mongoose connections below
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/login_reg');

var UserSchema = new mongoose.Schema({
    firstname: {type: String, required: [true, "First Name Required"]},
    lastname: {type: String, required: [true, "Last Name Required"]},
    email: {type: String, required: [true, "Email Required"]},
    password: {type: String, required: [true, "Password Required"]},
    birthdate: {type: Date, required: [true, "Birthdate required"]},
}, {timestamps: true});
var User = mongoose.model('User', UserSchema);
mongoose.Promise = global.Promise;
// use bodyParser!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({
    secret: 'codingdojorocks',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// use validation errors below but after session used
const flash = require('express-flash');
app.use(flash());
//bcrypt:
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.get("/", (req, res) => {
    // cannot destroy session due to flash but can regenerate to clear session data
    req.session.regenerate((err)=>{})
    User.find({}, (err, users)=>{
        console.log("USERS REGISTERED!!:", users);
    })
    res.render("index");
})

app.post("/register", (req, res) => {
    console.log("POST DATA", req.body);
    var count = 0;
    User.find({'email': req.body.email}, (err, reguser)=>{
        console.log("REGUSER LENGTH", reguser.length)
        count = reguser.length;
        console.log("COUNT", count)
        if(count > 0){
            req.flash("emailused", "This email is already registered");
            return res.redirect("/");
        }
    })
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log("HASH PW: ",hash);
        var newuser = new User({firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, birthdate: req.body.birthdate});
        var pwconfirm = (req.body.password == req.body.pwconfirm) ? console.log("PASSWORDS MATCH"): req.flash("password", "passwords must match");
        newuser.password = hash;
        newuser.save((err) => {
            if(err){
                console.log("Registration ERROR", err);
                for(var key in err.errors){
                    req.flash("registration", err.errors[key].message)
                }
                res.redirect("/");
            } else{
                console.log("New User Password", newuser.password);
                console.log("Successful Registration!", newuser);
                req.session.name = newuser.firstname;
                res.redirect("/success");
            }
        })
    })
})

app.post("/login", (req, res) => {
    console.log("POST DATA", req.body);
    User.findOne({"email": req.body.loginemail}, (err, user) => {
        console.log(user);
        if(user == null){
            req.flash("loginemail", "Email not registered");
            res.redirect("/");
        } else{
            bcrypt.compare(req.body.loginpw, user.password, (error, pw)=>{
                if(pw){
                    req.session.userid = user._id;
                    req.session.name = user.firstname;
                    res.redirect("/success");
                } else{
                    req.flash("loginpw", "Invalid Password");
                    res.redirect("/");
                }
            })
        }
    })
})

app.get("/success", (req, res)=>{
    if(req.session.name == null){
        res.redirect("/");
    } else{
        var name = req.session.name;
        res.render("success", {username: name});
    }
})

app.listen(8000, () => {
    console.log("listening to port 8000");
})