const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const logger = require('@albymbiju/express-pretty-logger');

const app = express();
connectDB();
app.use(express.json());

app.use(logger());

app.get("/health", (req, res) => {
    res.json({message: `RepairRadar is running successfully`});
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
