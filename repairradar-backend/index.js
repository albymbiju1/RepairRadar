require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("@albymbiju/express-pretty-logger");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(logger());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RepairRadar is running successfully",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`RepairRadar server running on port ${PORT}`);
  });
};

startServer();
