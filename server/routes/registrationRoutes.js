const express = require("express");

const router = express.Router();

const {
  createRegistration,
  getRegistrationHistory,
  getRegistrationById,
} = require("../controllers/registrationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a new registration
router.post("/", authMiddleware, createRegistration);

// Get logged-in student's registration history
router.get("/history", authMiddleware, getRegistrationHistory);

// Get a specific registration
router.get("/:id", authMiddleware, getRegistrationById);

module.exports = router;