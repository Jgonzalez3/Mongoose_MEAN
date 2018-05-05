var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
//Mongoose connections below
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_dojo');
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
}, {timestamps: true})
mongoose.model('User', UserSchema);
var User = mongoose.model('User');
mongoose.Promise = global.Promise;
// use bodyParser!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({secret: 'codingdojorocks'}));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// use validation errors below but after session
const flash = require('express-flash');
app.use(flash());
// root route to render the index.ejs view
app.get('/', function(req, res) {
    res.render("index");
})
app.get('/quotes', function(req, res) {
    var query;
    //grab session data to render in HTML
    User.find({}, null, {sort: '-createdAt'}, function(err, users){
        if(err){
            console.log("error with query");
        } else{
            console.log("successful query");
            query = users;
        }
        res.render("quotes", {quotes: query});  
    })
})
// post route for adding a user
app.post('/quotes', function(req, res) {
    //post form data here into session req.body is form data
    console.log("POST DATA", req.body);
    var user = new User({name: req.body.name, quote: req.body.quote});
    user.save(function(err){
        if(err){
            //user c.log below to display properties of errors for customization of messages
            console.log('something went wrong', err);
            for(var key in err.errors){
                if(err.errors[key].path == 'name'){
                    req.flash('quote', "Name is required");
                }
                if(err.errors[key].path == 'quote'){
                    req.flash('quote', "Quote is required");
                }
            }
            res.redirect("/");
        } else{
            console.log('successfully added a user!');
            res.redirect("/");
        }
    })
})
// tell the express app to listen on port 8000
app.listen(8000, function() {
        console.log("listening on port 8000");
});