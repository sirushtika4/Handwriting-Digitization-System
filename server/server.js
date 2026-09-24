const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const path = require("path");
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Handwriting Digitization API is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
