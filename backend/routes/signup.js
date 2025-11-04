let express = require('express');
let router = express.Router();
let handlecreateuser = require('../controller/signup');
router.post("/signup", handlecreateuser)

module.exports = router;