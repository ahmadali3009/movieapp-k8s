let express = require('express');
let loginrouter = express.Router();
let handleloginuser = require('../controller/login');
loginrouter.post("/login", handleloginuser)

module.exports = loginrouter;