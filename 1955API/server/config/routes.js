module.exports = (app)=>{
    var controller = require("../controllers/users")();
    app.get("/", (req, res)=>{
        controller.index(req, res);
    })
    app.get("/new/:name/", (req, res)=>{
        controller.newname(req, res);
    })
    app.get("/remove/:name/", (req, res)=>{
        controller.removename(req, res);
    })
    app.get("/:name/", (req, res)=>{
        controller.name(req, res);
    })
}