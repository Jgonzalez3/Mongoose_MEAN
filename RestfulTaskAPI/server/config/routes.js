module.exports = (app)=>{
    var controller = require("../controllers/tasks")();
    app.get("/tasks", (req, res)=>{
        controller.index(req, res);
    })
    app.get("/tasks/:id", (req, res)=>{
        controller.task(req, res);
    })
    app.post("/tasks", (req, res)=>{
        controller.createtask(req, res);
    })
    app.put("/tasks/edit/:id", (req, res)=>{
        controller.updatetask(req, res);
    })
    app.delete("/tasks/:id", (req, res)=>{
        controller.deletetask(req, res);
    })
}