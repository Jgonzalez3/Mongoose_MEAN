var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
//Mongoose connections below
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sharkdashboard');
var SharkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    length: {type: String, required: true},
    weight: {type: String, required: true},
    description: {type: String},
    image: {type: String, required: true},
    food: {type: String, required: true}
}, {timestamps: true})
mongoose.model('Shark', SharkSchema);
var Shark = mongoose.model('Shark');
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

// root route to render the index.ejs view
app.get('/', function(req, res) {
    var query;
    Shark.find({}, null, {sorted: 'name'}, function(err, sharks){
        if(err){
            console.log("error with query!!");
        } else{
            console.log("successful Query!!");
            query = sharks;
            console.log(sharks);
        }
        res.render("index", {sharks: query});
    })
})
app.get("/sharks/new", function(req, res){
    res.render("addshark");
})
app.post("/addshark", function(req, res){
    console.log("POSTDATA", req.body);
    var shark = new Shark({name: req.body.name, length: req.body.length, weight: req.body.weight, description: req.body.description, image: req.body.image, food: req.body.food});
    shark.save(function(err){
        if(err){
            console.log("Error with Insert", err);
            for(var key in err.errors){
                if(err.errors[key].path == "name"){
                    req.flash('shark', "Shark Name Required")
                }
                if(err.errors[key].path == "length"){
                    req.flash('shark', "Shark Length Required")
                }
                if(err.errors[key].path == "weight"){
                    req.flash('shark', "Shark Weight Required")
                }
                if(err.errors[key].path == "image"){
                    req.flash('shark', "Shark Image Url Required")
                }
                if(err.errors[key].path == "food"){
                    req.flash('shark', "Food item is Required")
                }
            }
            res.redirect("/sharks/new");
        } else{
            console.log("added Shark successfully!!!");
            res.redirect("/")
        }
    })
})
app.get("/sharks/:id", function(req, res){
    var query;
    console.log("REQ.PARAMS", req.params)
    console.log("REQ.PARAMS.ID", req.params.id)
    var id = req.params.id;
    Shark.findById(id, function(err, shark){
        if(err){
            console.log("error with query!!");
            res.redirect("/");
        } else{
            console.log("successful Query!!");
            query = shark;
            console.log(shark);
        }
        res.render("oneshark", {shark: query});
    })
})
app.get("/sharks/edit/:id", function(req, res){
    var query;
    console.log("REQ.PARAMS", req.params)
    console.log("REQ.PARAMS.ID", req.params.id)
    var id = req.params.id;
    Shark.findById(id, function(err, shark){
        if(err){
            console.log("error with query!!");
            res.redirect("/");
        } else{
            console.log("successful Query!!");
            query = shark;
            console.log(shark);
        }
        res.render("editshark", {shark: query});
    })
})
app.post("/sharks/:id", function(req, res){
    console.log("POSTDATA", req.body);
    console.log("REQ.PARAMS", req.params)
    console.log("REQ.PARAMS.ID", req.params.id)
    var id = req.params.id;
    Shark.findByIdAndUpdate(id, {name: req.body.name, length: req.body.length, weight: req.body.weight, description: req.body.description, image: req.body.image, food: req.body.food}, function(err, update){
        if(err){
            console.log("Error with Insert", err);
            res.redirect("/sharks/edit/"+id);
        } else{
            console.log("UPDATE", update);
            update.update();
            console.log("updated Shark successfully!!!");
            res.redirect("/sharks/"+id)
        }
    })
})
app.post("/sharks/destroy/:id", function(req, res){
    console.log("REQ.PARAMS", req.params)
    console.log("REQ.PARAMS.ID", req.params.id)
    var id = req.params.id;
    Shark.findByIdAndRemove(id, function(err, shark){
        if(err){
            console.log("Error with Deletion", err);
            res.redirect("/sharks/"+id);
        } else{
            console.log("Deleted Shark successfully!!!");
            res.redirect("/")
        }
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
});