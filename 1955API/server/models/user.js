require("../config/mongoose")();

const mongoose = require("mongoose");
module.exports = () =>{
    const UserSchema = new mongoose.Schema({
        name:{type: String}
    }, {timestamps: true});
    User = mongoose.model('User', UserSchema);
}