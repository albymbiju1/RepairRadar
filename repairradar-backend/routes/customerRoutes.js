const express = require("express");
const router = express.Router();

const {
    customerList
} = require('../controllers/customerController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const roles = require('../constants/roles');

router.route("/list").get(authMiddleware, roleMiddleware(roles.ADMIN), customerList);

module.exports = router;