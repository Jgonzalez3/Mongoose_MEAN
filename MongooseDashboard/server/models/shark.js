require("../config/mongoose")();
const mongoose = require('mongoose');
module.exports = () =>{

    const SharkSchema = new mongoose.Schema({
        name: {type: String, required: [true, "Shark Name Required"]},
        length: {type: String, required: [true, "Shark Length Required"]},
        weight: {type: String, required: [true, "Shark Weight Required"]},
        description: {type: String},
        image: {type: String, required: [true, "Shark Image Url Required"]},
        food: {type: String, required: [true, "Food item is Required"]}
    }, {timestamps: true})
    mongoose.model('Shark', SharkSchema);
    Shark = mongoose.model('Shark');
}