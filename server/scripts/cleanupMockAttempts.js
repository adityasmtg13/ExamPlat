require("dotenv").config();

const mongoose = require("mongoose");
const MockAttempt = require("../models/MockAttempt");

const buildSortKey = (attempt) => {
  const startedAt = attempt.startedAt ? new Date(attempt.startedAt).getTime() : 0;
  const createdAt = attempt.createdAt ? new Date(attempt.createdAt).getTime() : 0;

  return {
    startedAt,
    createdAt,
    id: String(attempt._id),
  };
};

const pickKeeper = (attempts) => {
  return [...attempts].sort((left, right) => {
    const leftKey = buildSortKey(left);
    const rightKey = buildSortKey(right);

    if (leftKey.startedAt !== rightKey.startedAt) {
      return rightKey.startedAt - leftKey.startedAt;
    }

    if (leftKey.createdAt !== rightKey.createdAt) {
      return rightKey.createdAt - leftKey.createdAt;
    }

    return rightKey.id.localeCompare(leftKey.id);
  })[0];
};

const removeDuplicates = async (label, keySelector) => {
  const attempts = await MockAttempt.find({}).lean();
  const groups = new Map();

  for (const attempt of attempts) {
    const key = keySelector(attempt);

    if (!key) {
      continue;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(attempt);
  }

  let deletedCount = 0;

  for (const [key, group] of groups.entries()) {
    if (group.length < 2) {
      continue;
    }

    const keeper = pickKeeper(group);
    const duplicates = group.filter((attempt) => String(attempt._id) !== String(keeper._id));

    if (duplicates.length === 0) {
      continue;
    }

    const duplicateIds = duplicates.map((attempt) => attempt._id);
    await MockAttempt.deleteMany({ _id: { $in: duplicateIds } });

    deletedCount += duplicateIds.length;

    console.log(
      `[${label}] kept ${keeper._id} for ${key} and removed ${duplicateIds.length} duplicates`
    );
  }

  return deletedCount;
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const legacyDeleted = await removeDuplicates(
      "legacy-registration",
      (attempt) =>
        attempt.registrationId && attempt.attemptNumber
          ? `${attempt.registrationId}:${attempt.attemptNumber}`
          : null
    );

    const legacyNullTestDeleted = await removeDuplicates(
      "legacy-null-testId",
      (attempt) =>
        !attempt.testId && attempt.studentId && attempt.attemptNumber
          ? `${attempt.studentId}:${attempt.attemptNumber}`
          : null
    );

    const currentDeleted = await removeDuplicates(
      "current-test",
      (attempt) =>
        attempt.studentId && attempt.testId && attempt.attemptNumber
          ? `${attempt.studentId}:${attempt.testId}:${attempt.attemptNumber}`
          : null
    );

    const collection = mongoose.connection.collection("mockattempts");
    const indexes = await collection.indexes();

    if (indexes.some((index) => index.name === "registrationId_1_attemptNumber_1")) {
      await collection.dropIndex("registrationId_1_attemptNumber_1");
      console.log("Dropped legacy index registrationId_1_attemptNumber_1");
    }

    await MockAttempt.syncIndexes();

    console.log(
      `Cleanup complete. Removed ${legacyDeleted + legacyNullTestDeleted + currentDeleted} duplicate mock attempt records.`
    );
  } catch (error) {
    console.error("Cleanup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

main();