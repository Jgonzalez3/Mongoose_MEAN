module.exports = ()=>{
    require("../models/user")();
    return{
        index: (req, res)=>{
            User.find({}, (err, users)=>{
                err = err ? console.log("ERRORS", err) & res.json({message: "ERROR", error: err}): res.json({message: "Success", data: users});
            })
        },
        newname: (req, res)=>{
            var name = req.params.name
            var newuser = new User({name: name});
            newuser.save((err)=>{
                err = err ? console.log("ERRORS ADD", err) & res.json({message: "ERROR", error: err}) : res.json({message: "Success"});
            })
        },
        removename: (req, res)=>{
            var name = req.params.name
            User.deleteOne({name: name}, (err)=>{
                err = err ? console.log("ERRORS REMOVE", err) & res.json({message: "ERROR", error: err}) : res.json({message: "Success"});
            })
        },
        name: (req, res)=>{
            var name = req.params.name;
            User.findOne({name: name}, (err, user)=>{
                err = err ? console.log("ERRORS", err) & res.json({message: "ERROR", error: err}): res.json({message: "Success", data: user});
            })
        }
    }
}