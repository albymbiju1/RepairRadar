const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login"
            });
        }
        
        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "User no longer exists"
                });
            }

            if(!user.isActive){
                return res.status(403).json({
                    success: false,
                    message: "Account is inactive. Please contact the administrator."
                });
            }

            req.user = user;

            next();
            
        } catch (error) {
            if(
                error.name === "JsonWebTokenError" ||
                error.name === "TokenExpiredError"
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }

            next(error)
        }
};

module.exports = authMiddleware;