var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
//Mongoose connections below
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/messageboard');

var CommentSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name Required for Comment"]},
    comment: {type: String, required: [true, "Comment required before post"]},
}, {timestamps: true});
var MessageSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name required for Message"]},
    message: {type: String, required: [true, "Message required before post"]},
    comments: [{type: CommentSchema, ref: 'Comment'}]
}, {timestamps: true});
var Message = mongoose.model('Message', MessageSchema);
var Comment = mongoose.model('Comment', CommentSchema);
mongoose.Promise = global.Promise;
// use bodyParser!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({secret: 'codingdojorocks'}));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// use validation errors below but after session used
const flash = require('express-flash');
app.use(flash());

app.get("/", (req, res) => {
    var query;
    Message.find({}, null, {sorted: 'createdAt'},(err, mess)=>{
        err = err ? console.log("ERROR with QUERY!!") : console.log("Query Success!!!"), query = mess, console.log(query), res.render("index", {messagequery: query})
    })
})
app.post("/postmessage", (req, res) => {
    console.log("POSTDATA", req.body);
    var message = new Message({name: req.body.name, message: req.body.message});
    message.save((err) => {
        if(err){
            console.log("Display Error:",err);
            for(var key in err.errors){
                req.flash("message", err.errors[key].message)
            }
            res.redirect("/")
        } else{
            console.log("message added!!");
            res.redirect("/")
        }
    })
})
app.post("/postcomment", (req, res) =>{
    console.log("POSTDATA", req.body);
    var comment = new Comment({name: req.body.name, comment: req.body.comment});
    var comerror;
    console.log("COMMENT", comment);
    var id = req.body.messageid;
    Message.findById(id, (err, update) =>{ 
        err = err ? res.redirect("/") : console.log("UPDATE ELSE HIT"), console.log(update.comments), console.log(comment), update.comments.push(comment), update.save(update);
        comment.save((error) => { 
            if(error){
                console.log("Display ERRORS:", error);
                for(var key in error.errors){
                    req.flash("commenterror", error.errors[key].message)
                }
                res.redirect("/");
                return error;
            } else{
                console.log("Comment Added!!");
                res.redirect("/");
            }
        });
    })
})

app.listen(8000, function(){
    console.log("listenting to port 8000")
})