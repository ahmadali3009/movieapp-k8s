let usersignup = require('../model/signup');
const jwt = require('jsonwebtoken');
const { generateToken , refreshtoken } = require('../service/security');
const { validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');

async function handleloginuser(req, res) {
    try{
        let {email , password} = req.body;

        // Validate login data
        const validation = validateLoginData({ email, password });
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Find user by email
        let user = await usersignup.findOne({email: email})
        if(!user)
        {
            return res.status(400).json({message: "Invalid credentials"})
        }

        // Compare password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword)
        {
            return res.status(400).json({message: "Invalid credentials"})
        }

        // Generate JWT token and refresh token 
        let refreshT = refreshtoken({email: user.email , id: user._id , createdAt: Date.now()})
        let token = generateToken({email: user.email , id: user._id , createdAt: Date.now()})
        return res.status(200).json({message: "login success" , token: token, refreshToken: refreshT});

       
    }
    catch(error)
    {
        return res.status(500).json({message: error.message})
    }
}

module.exports = handleloginuser;