let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let signupSchema = new Schema({
    username: String,
    email: String,
    password: String
})
let usersignup = mongoose.model('usersignup', signupSchema);
module.exports = usersignup;