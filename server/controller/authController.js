import User from "../model/userModel.js";
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Conform password do not match" });
        }
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (password.length < 8) {
            return res.status(400).json({message: 'password must be at least 8 characters long'})
        }
        const user = new User({ username, password});
        await user.save();
        res.status(201).json({ message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server error"});
    }
}

export const login = async (req, res) => {
    try {
        const { username, password} = req.body
        if (!username || !password) {
            return res.status(400).json({ message: "All field are required"});
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found"});
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) { 
            return res.status(400).json({ message: "Password is incorrect"});
        }
        const token = jwt.sign({ id: user._id, username: user.username}, process.env.SECRET_KEY, {expiresIn: '1d'})
        res.status(200).json({ message: "User logged in successfully", token})

    } catch (error) {
        res.status(500).json({ message: "Server error"});
    }
}