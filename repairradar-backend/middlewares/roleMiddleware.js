const roles = require("../constants/roles");

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(401).json({
                status: false,
                message: "Authentication required. Please login."
            });
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "You don't have permission to perform this action."
            });
        }

        if(req.user.role === roles.TECHNICIAN && !req.user.isApproved){
            return res.status(403).json({
                success: false,
                message: "Your technician account is awaiting approval"
            });
        }

        next();
        }
    };
    
module.exports = authorizeRoles;