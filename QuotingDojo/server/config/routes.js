const mongoose = require('mongoose');
const User = mongoose.model('User')

module.exports = (app, quotes)=>{
    var quotes = require("../controllers/quotes")()
    console.log(quotes);
    app.get("/", (req, res)=>{
        quotes.index(req, res);
    });
    app.get("/quotes", (req, res)=>{
        var query;
        User.find({}, null, {sort: '-createdAt'}, (err, users)=>{
            err = err ? console.log("error with query"): console.log("successful query"), query = users, res.render("quotes", {quotes: query});  
        })
    });
    app.post('/quotes', (req, res)=> {
        console.log("POST DATA", req.body);
        var user = new User({name: req.body.name, quote: req.body.quote});
        user.save(function(err){
            if(err){
                console.log('something went wrong', err);
                for(var key in err.errors){
                    req.flash("quote", err.errors[key].message)
                }
                res.redirect("/");
            } else{
                console.log('successfully added a user!');
                res.redirect("/");
            }
        })
    });
}
