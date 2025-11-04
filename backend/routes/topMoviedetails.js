let express = require('express');
let topmovierouter = express.Router();
const handletopmoviedetails = require('../controller/handletopmoviedetails');
const { authmiddleware } = require('../middleware/authmiddleware');
topmovierouter.get("/top-detail", authmiddleware, handletopmoviedetails);

module.exports = topmovierouter;