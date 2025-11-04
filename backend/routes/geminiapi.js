let express = require('express');
let geminirouter = express.Router();
let handlegeminiapi = require('../controller/geminiapi');
geminirouter.post("/gemini", handlegeminiapi)

module.exports = geminirouter;