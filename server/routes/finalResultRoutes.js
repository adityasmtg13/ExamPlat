const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getFinalResults } = require("../controllers/finalResultController");

const router = express.Router();

router.get("/", authMiddleware, getFinalResults);

module.exports = router;
