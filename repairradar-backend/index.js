require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("@albymbiju/express-pretty-logger");
const errorMiddleware = require('./middlewares/errorMiddleware');

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(logger());
app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RepairRadar is running successfully",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customers", customerRoutes);



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`RepairRadar server running on port ${PORT}`);
  });
};

startServer();
