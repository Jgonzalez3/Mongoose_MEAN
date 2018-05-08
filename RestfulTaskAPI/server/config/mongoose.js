const mongoose =  require("mongoose");

module.exports = ()=>{
    mongoose.connect('mongodb://localhost/restfulapi');
    mongoose.Promise = global.Promise;
}