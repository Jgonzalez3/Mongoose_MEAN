const mongoose =  require("mongoose");

module.exports = ()=>{
    mongoose.connect('mongodb://localhost/1955api');
    mongoose.Promise = global.Promise;
}
