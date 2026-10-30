const mongoose = require("mongoose");
const ExamRegistration = require("../models/ExamRegistration");

const stringId = (value) => (value == null ? "" : String(value));
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null);

const getFinalCollections = () => {
  const db = mongoose.connection.db;
  return {
    exams: db.collection("finalexams"),
    attempts: db.collection("finalattempts"),
  };
};

exports.getFinalResults = async (req, res) => {
  try {
    const studentId = req.student._id;
    const registrations = await ExamRegistration.find({
      studentId,
      status: "Registered",
    }).lean();
    const hallTicketNos = registrations
      .map((registration) => registration.registrationNumber)
      .filter(Boolean);

    const { exams, attempts } = getFinalCollections();
    const publishedExams = await exams.find({ resultsPublished: true }).toArray();
    if (!publishedExams.length) {
      return res.json({ success: true, results: [] });
    }

    // Published exam metadata is visible to students. Attempt documents below
    // are still restricted to the signed-in student's identity/registrations.
    const visibleExams = publishedExams;

    if (!visibleExams.length) {
      return res.json({ success: true, results: [] });
    }

    const visibleExamIds = visibleExams.map((exam) => exam._id);
    const visibleTestIds = visibleExams
      .flatMap((exam) => [exam.testId, exam.finalExamId])
      .filter(Boolean);
    const ownAttemptClauses = [
      { studentId: { $in: [studentId, stringId(studentId)] } },
      { candidateId: { $in: [studentId, stringId(studentId)] } },
      { userId: { $in: [studentId, stringId(studentId)] } },
      { email: req.student.email },
      { studentEmail: req.student.email },
      { candidateEmail: req.student.email },
    ];
    const registrationIds = registrations.map((registration) => registration._id);
    if (registrationIds.length) {
      ownAttemptClauses.push({ registrationId: { $in: [...registrationIds, ...registrationIds.map(stringId)] } });
    }
    if (hallTicketNos.length) {
      // Some finalattempts documents store the candidate hall ticket in
      // studentId instead of the app's Student ObjectId.
      ownAttemptClauses.push({ studentId: { $in: hallTicketNos } });
      ownAttemptClauses.push({ hallTicketNo: { $in: hallTicketNos } });
    }

    const attemptRows = await attempts.find({
      $and: [
        { $or: ownAttemptClauses },
        { $or: [
          { testMongoId: { $in: visibleExamIds.map(stringId).concat(visibleExamIds) } },
          { testId: { $in: visibleTestIds.concat(visibleExamIds.map(stringId)) } },
          { finalExamId: { $in: visibleExamIds.map(stringId).concat(visibleExamIds) } },
          { examId: { $in: visibleExamIds.map(stringId).concat(visibleExamIds) } },
          { exam: { $in: visibleExamIds.map(stringId).concat(visibleExamIds) } },
        ] },
      ],
    }).toArray();

    const results = visibleExams.map((exam) => {
      const examAttemptRows = attemptRows.filter((attempt) => {
        const refs = [attempt.testId, attempt.testMongoId, attempt.finalExamId, attempt.examId, attempt.exam].map(stringId);
        const examRefs = [exam._id, exam.testId, exam.finalExamId].filter(Boolean).map(stringId);
        return examRefs.some((ref) => refs.includes(ref));
      });
      return {
        exam: {
          id: stringId(exam._id),
          testId: exam.testId || exam.finalExamId || "",
          title: exam.title || exam.testTitle || exam.name || "Final Exam",
          category: exam.examCategory || exam.examType || exam.subject || "",
          totalMarks: exam.totalMarks ?? exam.maxMarks ?? null,
          publishedAt: exam.resultsPublishedAt || exam.publishedAt || exam.updatedAt || exam.createdAt || null,
        },
        attempts: examAttemptRows.map((attempt) => ({
          id: stringId(attempt._id),
          attemptNumber: attempt.attemptNumber ?? null,
          status: attempt.status ?? null,
          examType: attempt.examType ?? null,
          testTitle: attempt.testTitle ?? null,
          examCategory: attempt.examCategory ?? null,
          testId: attempt.testId ?? null,
          testMongoId: attempt.testMongoId ?? null,
          score: firstValue(attempt.score, attempt.marksObtained, attempt.obtainedMarks, attempt.marksScored, attempt.marks, attempt.totalScore, attempt.result?.score, attempt.result?.marksObtained, attempt.result?.marks),
          totalMarks: firstValue(attempt.totalMarks, attempt.maxMarks, attempt.fullMarks, attempt.result?.totalMarks, exam.totalMarks, exam.maxMarks),
          percentage: firstValue(attempt.percentage, attempt.percent, attempt.result?.percentage, attempt.result?.percent),
          correctAnswers: firstValue(attempt.correctAnswers, attempt.result?.correctAnswers),
          wrongAnswers: firstValue(attempt.wrongAnswers, attempt.result?.wrongAnswers),
          unanswered: firstValue(attempt.unanswered, attempt.result?.unanswered),
          timeTaken: firstValue(attempt.timeTaken, attempt.timeSpent, attempt.result?.timeTaken, attempt.result?.timeSpent),
          browser: attempt.browser == null
            ? null
            : typeof attempt.browser === "string"
              ? attempt.browser
              : JSON.stringify(attempt.browser),
          startedAt: attempt.startedAt || null,
          submittedAt: attempt.submittedAt || attempt.completedAt || attempt.updatedAt || null,
          createdAt: attempt.createdAt || null,
          updatedAt: attempt.updatedAt || null,
        }))
          .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
          .slice(0, 1),
      };
    }).sort((a, b) => a.exam.title.localeCompare(b.exam.title));

    res.json({ success: true, results });
  } catch (error) {
    console.error("Final results error:", error);
    res.status(500).json({ success: false, message: "Unable to load final results." });
  }
};
