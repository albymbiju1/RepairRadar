const bcrypt = require('bcryptjs');
const User = require('../models/User');
const roles = require('../constants/roles');
const generateToken = require('../utils/generateToken');

// POST /api/v1/auth/signup

const signup = async (req, res) => {
    try {
        const {name, email, password, phone } = req.body;

        if(
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password != "string" ||
            typeof phone !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password ||
            !phone.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input or missing fields"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            phone: phone.trim(),
            role: roles.CUSTOMER,
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        if(error.code === 11000){
            return res.status(409).json({
                success: false,
                messsage: "An account with these details already exists",
            });
        }

        next(error) 
    }
};

// POST /api/v1/auth/login

const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        if(typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password){
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if(!user || !await user.comparePassword(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if(!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact the administrator."
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            status: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

// GET /api/v1/auth/me

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        next(error)
    }
}

// POST /api/v1/auth/logout

const logout = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

module.exports = {
    signup,
    login,
    getMe,
    logout
};

