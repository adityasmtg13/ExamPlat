const Test = require("../models/Test");
const ExamRegistration = require("../models/ExamRegistration");
const MockAttempt = require("../models/MockAttempt");
const AllowedCandidate = require("../models/AllowedCandidate");
const createAuditLog = require("../utils/createAuditLog");

const examCategoryFromRegistration = (examType) => {
  if (examType === "JEE Main") {
    return "JEE";
  }

  if (examType === "NEET") {
    return "NEET";
  }

  return examType;
};

const examTypeFromCategory = (examCategory) => {
  if (examCategory === "JEE") {
    return "JEE Main";
  }

  return examCategory;
};

const registrationExamTypesToCategories = (registrations) => {
  return [...new Set(registrations.map((registration) => examCategoryFromRegistration(registration.examType)))];
};

const getStudentExamCategories = async (studentId) => {
  const registrations = await ExamRegistration.find({
    studentId,
    status: "Registered",
  }).sort({
    createdAt: -1,
  });

  return {
    registrations,
    examCategories: registrationExamTypesToCategories(registrations),
  };
};

const getMatchingRegistration = (registrations, examCategory) => {
  const matchedRegistration = registrations.find(
    (registration) => examCategoryFromRegistration(registration.examType) === examCategory
  );

  return matchedRegistration || registrations[0] || null;
};

const getStudentHallTicketNos = (registrations) => {
  return registrations
    .map((registration) => registration.registrationNumber)
    .filter(Boolean);
};

const getStudentAllowedTestIds = async (hallTicketNos) => {
  if (hallTicketNos.length === 0) {
    return [];
  }

  const allowedCandidates = await AllowedCandidate.find({
    hallTicketNo: { $in: hallTicketNos },
  })
    .select("testId")
    .lean();

  return allowedCandidates.map((candidate) => candidate.testId);
};

const isStudentAllowedForTest = (test, hallTicketNos, allowedTestIds) => {
  if (test.selectAllStudents) {
    return true;
  }

  if (hallTicketNos.length === 0 && allowedTestIds.length === 0) {
    return false;
  }

  // Check embedded allowedCandidates array (legacy support)
  const isInEmbeddedCandidates = (test.allowedCandidates || []).some(
    (candidate) => hallTicketNos.includes(candidate)
  );

  if (isInEmbeddedCandidates) {
    return true;
  }

  // Check allowedcandidates collection
  return allowedTestIds.some(
    (testId) => String(testId) === String(test._id)
  );
};

const buildTestAccessQuery = (hallTicketNos, allowedTestIds) => {
  const conditions = [{ selectAllStudents: true }];

  if (hallTicketNos.length > 0) {
    conditions.push({
      selectAllStudents: false,
      allowedCandidates: { $in: hallTicketNos },
    });
  }

  if (allowedTestIds.length > 0) {
    conditions.push({
      selectAllStudents: false,
      _id: { $in: allowedTestIds },
    });
  }

  return { $or: conditions };
};

const isTestOpen = (test) => {
  if (["Draft", "Closed", "Archived"].includes(test.status)) {
    return false;
  }

  const now = new Date();
  const startAt = test.defaultStartAt ? new Date(test.defaultStartAt) : null;
  const endAt = test.defaultEndAt ? new Date(test.defaultEndAt) : null;

  if (startAt && now < startAt) {
    return false;
  }

  if (endAt && now > endAt) {
    return false;
  }

  return true;
};

/**
 * Get Available Mock Tests
 * GET /api/mock-tests
 */
exports.getMockTests = async (req, res) => {
  try {
    const studentId = req.student.id;

    const { registrations, examCategories } = await getStudentExamCategories(studentId);

    const hallTicketNos = getStudentHallTicketNos(registrations);

    const allowedTestIds = await getStudentAllowedTestIds(hallTicketNos);

    const tests = await Test.find({
      testType: "mock",
      examCategory: { $in: examCategories },
      ...buildTestAccessQuery(hallTicketNos, allowedTestIds),
    })
      .sort({ defaultStartAt: 1, createdAt: -1 })
      .lean();

    const mockTests = [];

    for (const test of tests) {
      const completedAttempts = await MockAttempt.countDocuments({
        studentId,
        testId: test.testId,
        status: "Completed",
      });

      const remainingAttempts = Math.max(
        (test.defaultAttempts || 1) - completedAttempts,
        0
      );

      const canAttempt =
        isStudentAllowedForTest(test, hallTicketNos, allowedTestIds) &&
        examCategories.includes(test.examCategory) &&
        remainingAttempts > 0 &&
        isTestOpen(test);

      mockTests.push({
        ...test,

        attemptsUsed: completedAttempts,

        remainingAttempts,

        maximumAttempts: test.defaultAttempts || 1,

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
 * Get a single mock test
 * GET /api/mock-tests/detail/:testId
 */
exports.getMockTestById = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { testId } = req.params;

    const { registrations, examCategories } = await getStudentExamCategories(studentId);

    if (examCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    const hallTicketNos = getStudentHallTicketNos(registrations);

    const allowedTestIds = await getStudentAllowedTestIds(hallTicketNos);

    const test = await Test.findOne({
      testId,
      testType: "mock",
      examCategory: { $in: examCategories },
      ...buildTestAccessQuery(hallTicketNos, allowedTestIds),
    }).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found.",
      });
    }

    const completedAttempts = await MockAttempt.countDocuments({
      studentId,
      testId: test.testId,
      status: "Completed",
    });

    const remainingAttempts = Math.max(
      (test.defaultAttempts || 1) - completedAttempts,
      0
    );

    res.status(200).json({
      success: true,
      test: {
        ...test,
        attemptsUsed: completedAttempts,
        remainingAttempts,
        canAttempt:
          isStudentAllowedForTest(test, hallTicketNos, allowedTestIds) &&
          remainingAttempts > 0 &&
          isTestOpen(test),
      },
    });
  } catch (err) {
    console.error("Get Mock Test Error:", err);

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
    const { testId } = req.params;

    const test = await Test.findOne({ testId }).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found.",
      });
    }

    const attempts = await MockAttempt.find({
      studentId,
      testId,
    }).sort({
      attemptNumber: 1,
    });

    res.status(200).json({
      success: true,
      test,
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
    const { testId } = req.params;

    const registration = await ExamRegistration.findOne({
      studentId,
      status: "Registered",
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    const { examCategories, registrations } = await getStudentExamCategories(studentId);

    const hallTicketNos = getStudentHallTicketNos(registrations);

    const allowedTestIds = await getStudentAllowedTestIds(hallTicketNos);

    const test = await Test.findOne({
      testId,
      testType: "mock",
      examCategory: { $in: examCategories.length ? examCategories : ["JEE", "NEET"] },
      ...buildTestAccessQuery(hallTicketNos, allowedTestIds),
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found.",
      });
    }

    if (!["Scheduled", "Live"].includes(test.status)) {
      return res.status(400).json({
        success: false,
        message: "This mock test is not open for attempts yet.",
      });
    }

    if (!isStudentAllowedForTest(test, hallTicketNos, allowedTestIds)) {
      return res.status(403).json({
        success: false,
        message: "This mock test is not open for you.",
      });
    }

    if (!isTestOpen(test)) {
      return res.status(400).json({
        success: false,
        message: "This mock test is not open for attempts yet.",
      });
    }

    const matchedRegistration = getMatchingRegistration(registrations, test.examCategory);

    const activeAttempt = await MockAttempt.findOne({
      studentId,
      testId,
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
      studentId,
      testId,
      status: "Completed",
    });

    if (completedAttempts >= (test.defaultAttempts || 1)) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum mock test attempts reached.",
      });
    }

    // Next attempt number
    const attemptNumber = completedAttempts + 1;

    // Create attempt
    const attempt = await MockAttempt.create({
      studentId,
      registrationId: matchedRegistration?._id || null,
      testId: test.testId,
      testMongoId: String(test._id),
      examType:
        matchedRegistration?.examType ||
        examTypeFromCategory(test.examCategory),
      testTitle: test.title,
      examCategory: test.examCategory,
      attemptNumber,
      status: "In Progress",
      startedAt: new Date(),
    });

    await createAuditLog(
      studentId,
      "Started Mock Test",
      `Started ${test.title || "Mock Test"}`
    );

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
    const { testId } = req.params;

    const { examCategories, registrations } = await getStudentExamCategories(studentId);

    const hallTicketNos = getStudentHallTicketNos(registrations);

    const allowedTestIds = await getStudentAllowedTestIds(hallTicketNos);

    const test = await Test.findOne({
      testId,
      testType: "mock",
      examCategory: { $in: examCategories.length ? examCategories : ["JEE", "NEET"] },
      ...buildTestAccessQuery(hallTicketNos, allowedTestIds),
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found.",
      });
    }

    if (!isStudentAllowedForTest(test, hallTicketNos, allowedTestIds)) {
      return res.status(403).json({
        success: false,
        message: "This mock test is not open for you.",
      });
    }

    if (!isTestOpen(test)) {
      return res.status(400).json({
        success: false,
        message: "This mock test is not open for attempts yet.",
      });
    }

    const matchedRegistration = getMatchingRegistration(registrations, test.examCategory);

    // Find active attempt
    const activeAttempt = await MockAttempt.findOne({
      studentId,
      testId,
      status: "In Progress",
    });

    if (activeAttempt) {
      activeAttempt.status = "Completed";
      activeAttempt.submittedAt = new Date();

      await activeAttempt.save();
    }

    // Count completed attempts
    const completedAttempts = await MockAttempt.countDocuments({
      studentId,
      testId,
      status: "Completed",
    });

    if (completedAttempts >= (test.defaultAttempts || 1)) {
      return res.status(400).json({
        success: false,
        message: "Maximum mock test attempts reached.",
      });
    }

    // Create new attempt
    const attempt = await MockAttempt.create({
      studentId,
      registrationId: matchedRegistration?._id || null,
      testId: test.testId,
      testMongoId: String(test._id),
      examType:
        matchedRegistration?.examType ||
        examTypeFromCategory(test.examCategory),
      testTitle: test.title,
      examCategory: test.examCategory,
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
/**
 * Get Mock Test Result
 * GET /api/mock-tests/result/:attemptId
 */
exports.getMockResult = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { attemptId } = req.params;

    const attempt = await MockAttempt.findOne({
      _id: attemptId,
      studentId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Mock attempt not found.",
      });
    }

    const test = await Test.findOne({
      $or: [
        { testId: attempt.testId },
        { _id: attempt.testMongoId || attempt.testId },
      ],
    }).lean();

    await createAuditLog(
      studentId,
      "Viewed Result",
      `Viewed result for ${attempt.testTitle || "Mock Test"}`
    );

    res.status(200).json({
      success: true,
      result: {
        attemptId: attempt._id,

        testId: attempt.testId,

        testTitle: test?.title || attempt.testTitle,

        examType: attempt.examType,

        examCategory: attempt.examCategory,

        maximumAttempts: test?.defaultAttempts || 1,

        attemptNumber: attempt.attemptNumber,

        score: attempt.score,

        totalMarks: attempt.totalMarks,

        percentage: attempt.percentage,

        correctAnswers: attempt.correctAnswers,

        wrongAnswers: attempt.wrongAnswers,

        unanswered: attempt.unanswered,

        startedAt: attempt.startedAt,

        submittedAt: attempt.submittedAt,

        timeTaken: attempt.timeTaken,

        status: attempt.status,
      },
    });
  } catch (err) {
    console.error("Get Mock Result Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const studentId = req.student.id;

    const attempts = await MockAttempt.find({
      studentId,
      status: "Completed",
    }).sort({ submittedAt: -1 });

    const groupedAnalytics = {};

    let totalAttempts = 0;
    let totalPercentage = 0;
    let bestPercentage = 0;
    let totalTimeTaken = 0;

    for (const attempt of attempts) {
      const examType =
        attempt.testTitle || attempt.testId || attempt.examType;

      if (!groupedAnalytics[examType]) {
        groupedAnalytics[examType] = {
          examType,
          examCategory: attempt.examCategory || attempt.examType,
          totalAttempts: 0,
          totalScore: 0,
          totalMarks: 0,
          totalPercentage: 0,
          bestScore: 0,
          bestPercentage: 0,
          attempts: [],
        };
      }

      const group = groupedAnalytics[examType];

      group.totalAttempts++;
      group.totalScore += attempt.score;
      group.totalMarks += attempt.totalMarks;
      group.totalPercentage += attempt.percentage;

      if (attempt.score > group.bestScore) {
        group.bestScore = attempt.score;
      }

      if (attempt.percentage > group.bestPercentage) {
        group.bestPercentage = attempt.percentage;
      }

      group.attempts.push({
        attemptId: attempt._id,
        testId: attempt.testId,
        attemptNumber: attempt.attemptNumber,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
      });

      totalAttempts++;
      totalPercentage += attempt.percentage;
      totalTimeTaken += attempt.timeTaken;

      if (attempt.percentage > bestPercentage) {
        bestPercentage = attempt.percentage;
      }
    }

    Object.values(groupedAnalytics).forEach((group) => {
      group.averageScore = Number(
        (group.totalScore / group.totalAttempts).toFixed(2)
      );

      group.averagePercentage = Number(
        (group.totalPercentage / group.totalAttempts).toFixed(2)
      );

      delete group.totalScore;
      delete group.totalMarks;
      delete group.totalPercentage;
    });

    const overall = {
      totalAttempts,
      averagePercentage:
        totalAttempts > 0
          ? Number((totalPercentage / totalAttempts).toFixed(2))
          : 0,
      bestPercentage,
      totalTimeTaken,
    };

    res.status(200).json({
      success: true,
      overall,
      analytics: groupedAnalytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
    });
  }
};