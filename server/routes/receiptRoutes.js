const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { downloadReceipt } = require("../controllers/receiptController");

// Download receipt
// GET /api/receipt/:paymentId
router.get("/:paymentId", authMiddleware, downloadReceipt);

module.exports = router;