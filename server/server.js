const express = require("express");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const mockTestRoutes = require("./routes/mockTestRoutes");
const mockExamRoutes = require("./routes/mockExamRoutes");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/mock-tests", mockTestRoutes);
app.use("/api/mock-exam", mockExamRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("ExamPlat Backend Running...");
});

// Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});