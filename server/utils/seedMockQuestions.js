const fs = require("fs");
const path = require("path");

const Question = require("../models/Question");

const questionSources = [
  {
    examType: "JEE Main",
    filePath: path.join(__dirname, "../data/jeeQuestions.json"),
  },
  {
    examType: "NEET",
    filePath: path.join(__dirname, "../data/neetQuestions.json"),
  },
];

const loadQuestions = (examType, filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const questions = JSON.parse(fileContent);

  return questions.map((question) => ({
    questionId: question.id,
    examCategory: examType === "JEE Main" ? "JEE" : "NEET",
    questionText: question.question,
    options: question.options,
    correctOption: question.correctAnswer,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
    subject: question.subject,
  }));
};

const seedMockQuestions = async () => {
  const existingCount = await Question.countDocuments();

  if (existingCount > 0) {
    return;
  }

  const questionsToInsert = questionSources.flatMap(({ examType, filePath }) =>
    loadQuestions(examType, filePath)
  );

  if (questionsToInsert.length > 0) {
    await Question.insertMany(questionsToInsert, { ordered: false });
    console.log(`Seeded ${questionsToInsert.length} mock questions into MongoDB`);
  }
};

module.exports = seedMockQuestions;