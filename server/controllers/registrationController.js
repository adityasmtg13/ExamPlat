const ExamRegistration = require("../models/ExamRegistration");

/**
 * Generate Registration Number
 * Format: EX202600001
 */
const generateRegistrationNumber = async () => {
  const year = new Date().getFullYear();

  const lastRegistration = await ExamRegistration.findOne()
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastRegistration) {
    const last = lastRegistration.registrationNumber;

    // Extract numeric part
    const lastSequence = parseInt(last.slice(-5));

    nextNumber = lastSequence + 1;
  }

  return `EX${year}${String(nextNumber).padStart(5, "0")}`;
};

/**
 * Create Registration
 * POST /api/registration
 */
exports.createRegistration = async (req, res) => {
  try {
    const studentId = req.student.id; // From authMiddleware
    const { examType } = req.body;

    // Validate exam type
    if (!examType) {
      return res.status(400).json({
        success: false,
        message: "Please select an examination.",
      });
    }

    if (!["NEET", "JEE Main"].includes(examType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid examination selected.",
      });
    }

    // Prevent duplicate registration
    const existingRegistration = await ExamRegistration.findOne({
      studentId,
      examType,
      status: {
        $in: ["Pending Payment", "Registered"],
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this examination.",
      });
    }

    // Registration Fee
    const registrationFee =
      examType === "NEET" ? 500 : 600;

    // Registration Number
    const registrationNumber =
      await generateRegistrationNumber();

    // Save Registration
    const registration =
      await ExamRegistration.create({
        studentId,
        registrationNumber,
        examType,
        registrationFee,
      });

    res.status(201).json({
      success: true,
      message: "Registration created successfully.",
      registration,
    });

  } catch (err) {
    console.error("Registration Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get Student Registration History
 * GET /api/registration/history
 */
exports.getRegistrationHistory = async (req, res) => {
  try {
    const studentId = req.student.id;

    const registrations =
      await ExamRegistration.find({
        studentId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      registrations,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get Registration By ID
 * GET /api/registration/:id
 */
exports.getRegistrationById = async (req, res) => {
  try {
    const studentId = req.student.id;

    const registration =
      await ExamRegistration.findOne({
        _id: req.params.id,
        studentId,
      });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    res.status(200).json({
      success: true,
      registration,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};