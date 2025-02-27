import validator from 'validator';
import bcrypt from  'bcryptjs';
import jwt from "jsonwebtoken";  // Import jsonwebtoken
import userModel from '../models/userModel.js';  // Keep the .js extension

// Function to create JWT token
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Route for user login
const loginUser = async (req, res) => {
    // Implement login logic here
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});

        if (!user)
            return res. json({success:false, message: "User doesn't exists"})

        const isMatch = await bcrypt. compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({success : true, token})
        }
        else {
            res.json({success: false, message: 'Invalid credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new userModel({
            name, 
            email, 
            password: hashedPassword
        });

        // Save the user to the database
        const user = await newUser.save();

        // Generate a JWT token
        const token = createToken(user._id);

        // Return success response
        res.json({ success: true, message: "User created successfully", token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });  // Corrected to res.json
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    // Implement admin login logic here
    try {
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt. sign(email+password, process. env. JWT_SECRET);
            res.json( {success : true, token} )
        } else {
            res.json( {success: false, message: "Invalid credentials"})
        }
    } catch(error) {
        console.log(error);
        res.json({ success: false, message: error.message})
    }
};

export { loginUser, registerUser, adminLogin };