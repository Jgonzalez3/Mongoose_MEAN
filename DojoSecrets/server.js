var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
//Mongoose connections below
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dojosecrets');
var uniqueValidator = require("mongoose-unique-validator");
var CommentSchema = new mongoose.Schema({
    comment: {type: String, required: [true, "Comment must be written to post"]}
}, {timestamps:true})
var SecretSchema = new mongoose.Schema({
    secret: {type: String, required: [true, "Secret must be written to post"]},
    comments: [{type: CommentSchema, ref: 'Comment'}]
}, {timestamps: true})
var UserSchema = new mongoose.Schema({
    firstname: {type: String, required: [true, "First Name Required"]},
    lastname: {type: String, required: [true, "Last Name Required"]},
    email: {type: String, unique: true, uniqueCaseInsensitive: true , required: [true, "Email Required"]},
    password: {type: String, required: [true, "Password Required"]},
    birthdate: {type: Date, required: [true, "Birthdate required"]},
    secrets: [{type: SecretSchema, ref: 'Secret'}]
}, {timestamps: true});
//plug in unique validator
UserSchema.plugin(uniqueValidator, {message: `This {PATH} is already registered`});
var Comment = mongoose.model('Comment', CommentSchema);
var Secret = mongoose.model('Secret', SecretSchema);
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
                req.session.email = newuser.email;
                res.redirect("/secrets");
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
                    req.session.email = user.email;
                    res.redirect("/secrets");
                } else{
                    req.flash("loginpw", "Invalid Password");
                    res.redirect("/");
                }
            })
        }
    })
})
app.get("/secrets", (req, res)=>{
    if(req.session.email == null){
        res.redirect("/");
    } else{
        console.log(req.session.email);
        Secret.find({}, (err, secrets)=>{
        var query = secrets;
        console.log(secrets);
        User.findOne({"email": req.session.email}, (err, thisuser)=>{
            console.log("QuerySecret", query);
            console.log("THIS USER", thisuser);
            console.log("THIS USER SECRETS", thisuser.secrets);
            res.render("secrets", {showsecrets: query, user: thisuser.secrets});
        })
    })}
})
app.post("/postsecret", (req, res)=>{
    console.log("POSTDATA", req.body);
    var newsecret = new Secret({secret: req.body.secret});
    console.log(newsecret);
    var useremail = req.session.email;
    console.log(useremail)
    User.findOne({'email': useremail}, (err, update) =>{
        err = err ? res.redirect("/secrets") : console.log(update), update.secrets.push(newsecret), update.save(update);
        newsecret.save((error)=>{
            if(error){
                console.log("SECRET VALID ERR:",error);
                for(var key in error.errors){
                    req.flash("secreterror", error.errors[key].message)
                }
                res.redirect("/secrets");
            }
            else{
                console.log("SECRET ADDED!!");
                res.redirect("/secrets");
            }
        })
    })
})
app.get("/secrets/:id", (req, res) =>{
    var secretid = req.params.id;
    Secret.findById(secretid, (err, secret)=>{
        console.log("SECRET PAGE comments:", secret.comments);
        res.render("secretcomments", {secretquery: secret, secretcomments: secret.comments});
    })
})
app.post("/postcomment", (req, res) =>{
    console.log("POSTDATA", req.body);
    var newcomment = new Comment({comment: req.body.comment});
    var id = req.body.secretid;
    console.log(id);
    Secret.findById(id, (err, secret)=>{
        console.log("SECRETS", secret);
        secret.comments.push(newcomment); secret.save(secret);
        newcomment.save((error)=>{
            if(error){
                console.log("COMMENT VALID ERR:", error);
                for(var key in error.errors){
                    req.flash("comerror", error.errors[key].message)
                }
                res.redirect(`/secrets/${id}`)
            } else{
                res.redirect(`/secrets/${id}`);
            }
        })
    })
})

app.listen(8000, () => {
    console.log("listening to port 8000");
})