let usersignup = require('../model/signup');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');

async function handlecreateuser(req, res) {
    try {
        let { email, password, username } = req.body;

        // Validate user data
        const validation = validateSignupData({ email, password, username });
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Check if user already exists
        let userexist = await usersignup.findOne({ email })
        if (userexist) {
            return res.status(400).json({ message: "user already exist" })
        }

        // Hash password with bcrypt
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with hashed password
        let user = await usersignup.create({
            email,
            password: hashedPassword, // Store hashed password
            username
        })

        if (!user) {
           return res.status(400).json({ message: "user not created" })
        }
        return  res.status(201).json({ message: "user created" })
    }
    catch (error) {
       console.error('Signup error:', error);
       return res.status(500).json({ message: error.message })
    }
}

module.exports = handlecreateuser;
