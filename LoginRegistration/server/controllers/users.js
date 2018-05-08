module.exports = ()=>{
    require("../models/user")();
    //bcrypt:
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return{
        index: (req, res) => {
            // cannot destroy session due to flash but can regenerate to clear session data
            req.session.regenerate((err)=>{})
            User.find({}, (err, users)=>{
                console.log("USERS REGISTERED!!:", users);
            })
            res.render("index");
        },
        postregister: (req, res) => {
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
                        req.session.name = newuser.firstname;
                        res.redirect("/success");
                    }
                })
            })
        },
        postlogin: (req, res) => {
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
        },
        success: (req, res)=>{
            if(req.session.name == null){
                res.redirect("/");
            } else{
                var name = req.session.name;
                res.render("success", {username: name});
            }
        }
    }
}