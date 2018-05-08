
module.exports = ()=>{
    require("../models/shark")();
    return{
        index: (req, res) =>{
            var query;
            Shark.find({}, null, {sorted: 'name'}, (err, sharks) =>{
                err = err ? console.log("error with query!!") : console.log("successful Query!!"), query = sharks, console.log(sharks), res.render("index", {sharks: query})
            })
        },
        newshark: (req, res) => {
            res.render("addshark");
        },
        postaddshark: (req, res) => {
            console.log("POSTDATA", req.body);
            var shark = new Shark({name: req.body.name, length: req.body.length, weight: req.body.weight, description: req.body.description, image: req.body.image, food: req.body.food});
            shark.save((err) => {
                if(err){
                    console.log("Error with Insert", err);
                    for(var key in err.errors){
                        req.flash('shark', err.errors[key].message)
                    }
                    res.redirect("/sharks/new");
                } else{
                    console.log("added Shark successfully!!!");
                    res.redirect("/")
                }
            })
        },
        showshark: (req, res) =>{
            var query;
            console.log("REQ.PARAMS", req.params)
            console.log("REQ.PARAMS.ID", req.params.id)
            var id = req.params.id;
            Shark.findById(id, (err, shark) => {
                err = err ? res.redirect("/") & console("Query Failed"): console.log("successful Query!!"), query = shark, console.log(shark), res.render("oneshark", {shark: query});
            })
        },
        editshark: (req, res) =>{
            var query;
            console.log("REQ.PARAMS", req.params)
            console.log("REQ.PARAMS.ID", req.params.id)
            var id = req.params.id;
            Shark.findById(id, (err, shark) => {
                err =  err ? console.log("error with query!!") & res.redirect("/"): console.log("successful Query!!"), query = shark, console.log(shark), res.render("editshark", {shark: query});
            })
        },
        posteditshark: (req, res) =>{
            console.log("POSTDATA", req.body);
            console.log("REQ.PARAMS", req.params)
            console.log("REQ.PARAMS.ID", req.params.id)
            var id = req.params.id;
            Shark.findByIdAndUpdate(id, {name: req.body.name, length: req.body.length, weight: req.body.weight, description: req.body.description, image: req.body.image, food: req.body.food}, function(err, update){
                err = err ? console.log("Error with Insert", err) & res.redirect("/sharks/edit/"+id): console.log("UPDATE", update), update.update(), console.log("updated Shark successfully!!!"),res.redirect("/sharks/"+id);
            })
        },
        postdestroyshark: (req, res) =>{
            console.log("REQ.PARAMS", req.params)
            console.log("REQ.PARAMS.ID", req.params.id)
            var id = req.params.id;
            Shark.findByIdAndRemove(id, (err, shark) => {
                err = err ? console.log("Error with Deletion", err) & res.redirect("/sharks/"+id): console.log("Deleted Shark successfully!!!"), res.redirect("/")
            })
        }
    }
}