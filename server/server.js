const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");

// Force DNS resolution through public resolvers for MongoDB Atlas SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
const auditRoutes = require("./routes/auditRoutes");
const rankPredictionRoutes = require("./routes/rankPredictionRoutes");
const collegePredictionRoutes = require("./routes/collegePredictionRoutes");
const paymentLifecycle = require("./services/paymentLifecycle");
const { resolveSender } = require("./utils/mailSender");

/**
 * Mail configuration sanity check. Logs a clear warning at boot if the app
 * can never send email (missing SMTP credentials), so a misconfigured
 * environment (e.g. Render missing the BREVO_* variables) is obvious in the
 * logs instead of silently producing 500s / silent send failures.
 */
const verifyMailConfig = () => {
  const hasUser = !!process.env.BREVO_SMTP_USER;
  const hasPass = !!process.env.BREVO_SMTP_PASS;

  if (!hasUser || !hasPass) {
    console.error(
      "⚠️  BREVO SMTP credentials are MISSING " +
        "(BREVO_SMTP_USER / BREVO_SMTP_PASS not set). " +
        "ALL emails (OTP, password reset, payment receipts, mock results) " +
        "will fail. Add them to server/.env locally and to the Render " +
        "dashboard Environment for production."
    );
    return false;
  }

  console.log(`📧 Mail configured → From: ${resolveSender()}`);
  return true;
};

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
app.use("/api/audit", auditRoutes);
app.use("/api/predict-rank", rankPredictionRoutes);
app.use("/api/predict-colleges", collegePredictionRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("ExamPlat Backend Running...");
});

// Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  verifyMailConfig();

  // Payment lifecycle sweeper: enforces 5-minute session expiry, confirms
  // received payments from the (mock) middleman, and finalizes receipts
  // after the 20-second grace period — even with no user connected.
  paymentLifecycle.startLifecycleSweeper();
});
