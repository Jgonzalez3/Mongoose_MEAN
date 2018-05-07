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
// require("./server/models/user");
// var UserSchema = new mongoose.Schema({
//     name: {type: String, required: [true, "Name is required"]},
//     quote: {type: String, required: [true, "Quote is Required"]}
// }, {timestamps: true})
// mongoose.model('User', UserSchema);
// var User = mongoose.model('User');
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
require('./server/config/routes.js')(app)

app.listen(8000, function() {
    console.log("listening on port 8000");
})