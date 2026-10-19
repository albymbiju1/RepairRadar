const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    getMe,
    logout
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(authMiddleware, getMe);
router.route("/logout").post(authMiddleware, logout);

module.exports = router;
