const mongoose = require("mongoose");
const Student = require("../models/Student");
const MockAttempt = require("../models/MockAttempt");
const seedMockQuestions = require("../utils/seedMockQuestions");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    try {
      const studentCollection = mongoose.connection.collection("students");
      const indexes = await studentCollection.indexes();
      const aadhaarIndex = indexes.find((index) => index.name === "aadhaar_1");

      if (aadhaarIndex) {
        await studentCollection.dropIndex("aadhaar_1");
      }

      await Student.syncIndexes();
      await MockAttempt.syncIndexes();

      const mockAttemptCollection = mongoose.connection.collection("mockattempts");
      const mockAttemptIndexes = await mockAttemptCollection.indexes();
      const staleAttemptIndex = mockAttemptIndexes.find(
        (index) => index.name === "registrationId_1_attemptNumber_1"
      );

      if (staleAttemptIndex) {
        await mockAttemptCollection.dropIndex("registrationId_1_attemptNumber_1");
      }

      await seedMockQuestions();
    } catch (indexError) {
      console.error("Index sync warning:", indexError.message);
    }

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;