require("../config/mongoose")();

const mongoose = require("mongoose");
module.exports = () =>{
    const TaskSchema = new mongoose.Schema({
        title: {type: String},
        description: {type: String},
        completed: {type: Boolean, default: false},
    }, {timestamps: true})
    Task = mongoose.model('Task', TaskSchema)
}