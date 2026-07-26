const ExamRegistration = require("../models/ExamRegistration");
const MockAttempt = require("../models/MockAttempt");

/**
 * Get Available Mock Tests
 * GET /api/mock-tests
 */
exports.getMockTests = async (req, res) => {
  try {
    const studentId = req.student.id;

    // Fetch all registrations for the student
    const registrations = await ExamRegistration.find({
      studentId,
    }).sort({
      createdAt: -1,
    });

    const mockTests = [];

    for (const registration of registrations) {
      // Count completed attempts
      const completedAttempts = await MockAttempt.countDocuments({
        registrationId: registration._id,
        status: "Completed",
      });

      const remainingAttempts = Math.max(
        3 - completedAttempts,
        0
      );

      const canAttempt =
        registration.status === "Registered" &&
        remainingAttempts > 0;

      mockTests.push({
        registrationId: registration._id,

        registrationNumber:
          registration.registrationNumber,

        examType: registration.examType,

        registrationStatus:
          registration.status,

        attemptsUsed: completedAttempts,

        remainingAttempts,

        maximumAttempts: 3,

        canAttempt,
      });
    }

    res.status(200).json({
      success: true,
      mockTests,
    });
  } catch (err) {
    console.error("Mock Tests Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get Mock Attempt History
 * GET /api/mock-tests/history/:registrationId
 */
exports.getMockAttemptHistory = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { registrationId } = req.params;

    // Verify registration belongs to student
    const registration = await ExamRegistration.findOne({
      _id: registrationId,
      studentId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    const attempts = await MockAttempt.find({
      registrationId,
    }).sort({
      attemptNumber: 1,
    });

    res.status(200).json({
      success: true,
      registrationNumber:
        registration.registrationNumber,
      examType: registration.examType,
      attempts,
    });
  } catch (err) {
    console.error("Mock Attempt History Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
/**
 * Start Mock Test
 * POST /api/mock-tests/start/:registrationId
 */
exports.createMockAttempt = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { registrationId } = req.params;

    // Verify registration belongs to the student
    const registration = await ExamRegistration.findOne({
      _id: registrationId,
      studentId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // Payment must be completed
    if (registration.status !== "Registered") {
      return res.status(400).json({
        success: false,
        message:
          "Complete the registration payment before attempting the mock test.",
      });
    }

    // Prevent multiple active attempts
    const activeAttempt = await MockAttempt.findOne({
      registrationId,
      status: "In Progress",
    });

    if (activeAttempt) {
  return res.status(409).json({
    success: false,
    activeAttempt: true,
    attemptId: activeAttempt._id,
    message:
      "A mock test attempt is already in progress. Do you want to submit it and start a new one?",
  });
}

    // Count completed attempts
    const completedAttempts = await MockAttempt.countDocuments({
      registrationId,
      status: "Completed",
    });

    if (completedAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum of 3 mock test attempts reached.",
      });
    }

    // Next attempt number
    const attemptNumber = completedAttempts + 1;

    // Create attempt
    const attempt = await MockAttempt.create({
      studentId,
      registrationId,
      examType: registration.examType,
      attemptNumber,
      status: "In Progress",
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Mock test started successfully.",
      attempt,
    });

  } catch (err) {
    console.error("Create Mock Attempt Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Submit current attempt and start a new one
 * POST /api/mock-tests/submit-and-restart/:registrationId
 */
exports.submitAndRestartMockAttempt = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { registrationId } = req.params;

    // Verify registration
    const registration = await ExamRegistration.findOne({
      _id: registrationId,
      studentId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // Find active attempt
    const activeAttempt = await MockAttempt.findOne({
      registrationId,
      status: "In Progress",
    });

    if (activeAttempt) {
      activeAttempt.status = "Completed";
      activeAttempt.submittedAt = new Date();

      await activeAttempt.save();
    }

    // Count completed attempts
    const completedAttempts = await MockAttempt.countDocuments({
      registrationId,
      status: "Completed",
    });

    if (completedAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 3 mock test attempts reached.",
      });
    }

    // Create new attempt
    const attempt = await MockAttempt.create({
      studentId,
      registrationId,
      examType: registration.examType,
      attemptNumber: completedAttempts + 1,
      status: "In Progress",
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Previous attempt submitted successfully.",
      attempt,
    });

  } catch (err) {
    console.error("Submit And Restart Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};