import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import UserModel from "../Models/user.js";
import dotenv from 'dotenv';

dotenv.config(); 

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        const hashedPassword = await hash(password, 10);
        const userModel = new UserModel({ name, email, password: hashedPassword });

        await userModel.save();
        res.status(201).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(name);
        
        const user = await UserModel.findOne({ name:name });

        if (!user) {
            return res.status(403).json({ 
                message: 'Auth failed: Name or password is wrong', 
                success: false 
            });
        }

        const isPassEqual = await compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ 
                message: 'Auth failed: Name or password is wrong', 
                success: false 
            });
        }

        const jwtToken = jwt.sign(
            { name: user.name, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email: user.email,  // Fixed missing 'email' reference
            name: user.name
        });
    } catch (err) {
        console.log("xfcgh");
        
        console.error("Login Error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
