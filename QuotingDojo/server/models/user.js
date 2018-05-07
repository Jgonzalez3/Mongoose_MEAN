const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required"]},
    quote: {type: String, required: [true, "Quote is Required"]}
}, {timestamps: true})
mongoose.model('User', UserSchema);
module.exports = UserSchema;