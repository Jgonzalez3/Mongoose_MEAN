module.exports = ()=>{
    require("../models/task")();
    return{
        index: (req, res)=>{
            Task.find({}, (err, tasks)=>{
                err=err ? console.log("ERROR ALL:", err) & res.json({message: "INDEX ERROR"}): res.json({message: "Success", data: tasks});
            })
        },
        task: (req, res)=>{
            var taskname = req.params.id
            Task.findOne({title: taskname}, (err, task)=>{
                err=err ? console.log("ERROR THIS TASK", err) & res.json({message: "TASK ERROR"}): res.json({message: "Success", data:task});
            })
        },
        createtask: (req, res)=>{
            newtask = new Task({title: req.body.title, description: req.body.description});
            newtask.save((err)=>{
                err =err ? console.log("Create ERROR") & res.json("CREATE ERROR", err): res.json({message: "Success"})
            })
        },
        updatetask: (req, res)=>{
            var taskid = req.params.id;
            if(req.body.completed == null){
                req.body.completed = false;
            }
            Task.findByIdAndUpdate(taskid, {title: req.body.title, description: req.body.description, completed: req.body.completed}, (err, task)=>{
                err=err ? console.log("UPDATE ERROR", err) & res.json({error: err}): res.json({message: "Success"});
            })
        },
        deletetask: (req, res)=>{
            var taskid = req.params.id;
            console.log(taskid);
            Task.deleteOne({_id: taskid}, (err)=>{
                err=err ? console.log("ERRORS Remove", err) & res.json({error: err}): res.json({message: "Success"})
            })
        }
    }
}