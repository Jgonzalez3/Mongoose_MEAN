module.exports = (app)=>{
    var users = require("../controllers/users")();
    app.get("/", (req, res) => {
        users.index(req, res);
    })
    
    app.post("/register", (req, res) => {
        users.postregister(req, res);
    })
    
    app.post("/login", (req, res) => {
        users.postlogin(req, res);
    })
    
    app.get("/success", (req, res)=>{
        users.success(req, res);
    })
}