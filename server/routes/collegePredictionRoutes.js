const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    predictCollegeOptions
} = require("../controllers/collegePredictionController");


// POST /api/predict-colleges
router.post(
    "/",
    authMiddleware,
    predictCollegeOptions
);


module.exports = router;