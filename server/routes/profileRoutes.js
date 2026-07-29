const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  sendAccountSettingsOtp,
  verifyAccountSettingsOtp,
  uploadProfilePhoto,
  deleteProfilePhoto,
} = require("../controllers/profileController");

// Profile
router.get("/", authMiddleware, getProfile);

router.put("/", authMiddleware, updateProfile);
router.post("/settings/send-otp", authMiddleware, sendAccountSettingsOtp);
router.post("/settings/verify-otp", authMiddleware, verifyAccountSettingsOtp);

// Profile Photo
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

router.delete(
  "/photo",
  authMiddleware,
  deleteProfilePhoto
);

module.exports = router;