
module.exports = (app) =>{
    var sharks = require("../controllers/sharks")()
    app.get('/', (req, res) =>{
        sharks.index(req, res);
    })
    app.get("/sharks/new", (req, res) => {
        sharks.newshark(req, res);
    })
    app.post("/addshark", (req, res) => {
        sharks.postnewshark(req, res);
    })
    app.get("/sharks/:id", (req, res) =>{
        sharks.showshark(req, res);
    })
    app.get("/sharks/edit/:id", (req, res) =>{
        sharks.editshark(req, res);
    })
    app.post("/sharks/:id", (req, res) =>{
        sharks.posteditshark(req, res);
    })
    app.post("/sharks/destroy/:id", (req, res) =>{
        sharks.postdestroyshark(req, res);
    })
}