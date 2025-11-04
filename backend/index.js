// Load environment variables
require('dotenv').config();

const express = require('express');
const server = express();
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const Port = process.env.PORT || 5000;
const connect = require('./connection');
const signuproute = require('./routes/signup');
const loginroute = require('./routes/login');
const topmovieroute = require('./routes/topMoviedetails');
const geminirouter = require("./routes/geminiapi") 
const refreshTrouter = require('./routes/refreshT');
const jwt = require('jsonwebtoken');
const {authmiddleware} = require('./middleware/authmiddleware');

// Middleware
// Security headers with Helmet (Basic protection)
server.use(helmet());

// Configure CORS to allow requests from your frontend domain
server.use(cors({
  origin: ['http://localhost:5173', 'https://movieapp-1-9vz5.onrender.com', 'http://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Explicitly handle OPTIONS preflight requests
server.options('*', cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// Test route
server.get('/api/health', (req, res) => {  res.json({ message: 'Server is running!' });
});

server.use('/api', signuproute);
server.use('/api', loginroute);
server.use('/api', refreshTrouter);
// Middleware to handle JWT authentication
server.use('/api' , geminirouter);
server.use('/api' , topmovieroute);
// Use environment variable for MongoDB connection or fallback to default
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/movieapp";
connect(dbUrl);
server.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}`);
});
