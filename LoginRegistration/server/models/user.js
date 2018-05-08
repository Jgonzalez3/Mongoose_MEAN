require("../config/mongoose")();

const mongoose = require("mongoose");
module.exports = ()=>{
    var uniqueValidator = require("mongoose-unique-validator");
    const UserSchema = new mongoose.Schema({
        firstname: {type: String, required: [true, "First Name Required"]},
        lastname: {type: String, required: [true, "Last Name Required"]},
        email: {type: String, unique: true, uniqueCaseInsensitive: true , required: [true, "Email Required"]},
        password: {type: String, required: [true, "Password Required"]},
        birthdate: {type: Date, required: [true, "Birthdate required"]},
    }, {timestamps: true});
    //plug in unique validator
    UserSchema.plugin(uniqueValidator, {message: `This {PATH} is already registered`});
    User = mongoose.model('User', UserSchema);
}

