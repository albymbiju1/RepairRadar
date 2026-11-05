const User = require("../models/User");
const roles = require("../constants/roles");

const customerList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const users = await User.find({role: roles.CUSTOMER})
        .skip(skip)
        .limit(limit)
        .select("-password")

       if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No customers found",
        });
        }
        
        return res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            users
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    customerList
}