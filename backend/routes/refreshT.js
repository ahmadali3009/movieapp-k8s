let express = require('express');
let refreshTrouter = express.Router();
let {refreshtoken} = require("../middleware/authmiddleware");
refreshTrouter.post("/refreshtoken", refreshtoken)

module.exports = refreshTrouter;