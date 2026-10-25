const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const controllerPath = path.resolve(__dirname, "../controllers/authController.js");
const dependency = (relative) => require.resolve(path.resolve(__dirname, relative));

const records = new Map();
let mailFailure = false;
let mailCalls = 0;

const saveableStudent = (values) => ({
  ...values,
  async save() {
    records.set(this.email, this);
  },
  toObject() {
    return { ...this };
  },
});

require.cache[dependency("../models/Student")] = {
  exports: {
    async findOne({ email }) {
      return records.get(email) || null;
    },
    async create(values) {
      const student = saveableStudent({ _id: "student-id", ...values });
      records.set(student.email, student);
      return student;
    },
    async findById() {
      return null;
    },
  },
};
require.cache[dependency("../models/Payment")] = { exports: {} };
require.cache[dependency("../utils/mailSender")] = {
  exports: {
    async sendExamPlatMail() {
      mailCalls += 1;
      if (mailFailure) throw new Error("SMTP unavailable");
    },
  },
};
require.cache[dependency("../utils/createAuditLog")] = { exports: async () => {} };
require.cache[require.resolve("bcryptjs")] = {
  exports: {
    async hash(password) {
      return `hashed:${password}`;
    },
    async compare(password, hash) {
      return hash === `hashed:${password}`;
    },
  },
};
require.cache[require.resolve("jsonwebtoken")] = { exports: { sign: () => "test-token" } };
delete require.cache[controllerPath];
const authController = require(controllerPath);

const response = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const request = (body) => ({ body });

test.beforeEach(() => {
  records.clear();
  mailFailure = false;
  mailCalls = 0;
});

test("reset password requires the explicit newPassword contract", async () => {
  const res = response();
  await authController.resetPassword(request({ email: "student@example.com", otp: "123456", password: "ValidPass1!" }), res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Email, OTP, and new password are required.");
});

test("reset password rejects wrong and expired OTPs", async () => {
  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    password: "hashed:OldPass1!",
    otp: "123456",
    otpExpiresAt: new Date(Date.now() + 60_000),
  });
  records.set(student.email, student);
  let res = response();
  await authController.resetPassword(request({ email: student.email, otp: "000000", newPassword: "ValidPass1!" }), res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Invalid or expired OTP.");

  student.otpExpiresAt = new Date(Date.now() - 1);
  res = response();
  await authController.resetPassword(request({ email: student.email, otp: "123456", newPassword: "ValidPass1!" }), res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Invalid or expired OTP.");
});

test("reset password hashes, persists, invalidates the OTP, and preserves normal login", async () => {
  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    password: "hashed:OldPass1!",
    otp: "123456",
    otpExpiresAt: new Date(Date.now() + 60_000),
  });
  records.set(student.email, student);
  const res = response();
  await authController.resetPassword(request({ email: student.email, otp: "123456", newPassword: "ValidPass1!" }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(student.password, "hashed:ValidPass1!");
  assert.equal(student.otp, null);
  assert.equal(student.otpExpiresAt, null);

  const reused = response();
  await authController.resetPassword(request({ email: student.email, otp: "123456", newPassword: "AnotherPass1!" }), reused);
  assert.equal(reused.statusCode, 400);

  const oldLogin = response();
  await authController.loginStudent(request({ email: student.email, password: "OldPass1!" }), oldLogin);
  assert.equal(oldLogin.statusCode, 400);
  const newLogin = response();
  await authController.loginStudent(request({ email: student.email, password: "ValidPass1!" }), newLogin);
  assert.equal(newLogin.statusCode, 200);
});

test("registration reports email failure without claiming an OTP was sent", async () => {
  mailFailure = true;
  const res = response();
  await authController.registerStudent(request({
    name: "Test Student",
    email: "student@example.com",
    password: "ValidPass1!",
    confirmPassword: "ValidPass1!",
  }), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.registrationPending, true);
  assert.equal(records.get("student@example.com").isEmailVerified, false);
});

test("registration verification accepts only the current, unexpired OTP", async () => {
  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    password: "hashed:ValidPass1!",
    otp: "123456",
    otpExpiresAt: new Date(Date.now() + 60_000),
    isEmailVerified: false,
  });
  records.set(student.email, student);
  let res = response();
  await authController.verifyOtp(request({ email: student.email, otp: "000000" }), res);
  assert.equal(res.statusCode, 400);

  res = response();
  await authController.verifyOtp(request({ email: student.email, otp: "123456" }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(student.isEmailVerified, true);
  assert.equal(student.otp, null);
  assert.equal(student.otpExpiresAt, null);
});

test("resend restores the previous OTP if email submission fails", async () => {
  const previousExpiry = new Date(Date.now() + 60_000);
  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    otp: "111111",
    otpExpiresAt: previousExpiry,
    isEmailVerified: false,
  });
  records.set(student.email, student);
  mailFailure = true;
  const res = response();
  await authController.resendOtp(request({ email: student.email }), res);
  assert.equal(res.statusCode, 500);
  assert.equal(student.otp, "111111");
  assert.equal(student.otpExpiresAt, previousExpiry);
});

test("resend replaces the OTP only for unverified accounts", async () => {
  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    otp: "111111",
    otpExpiresAt: new Date(Date.now() + 60_000),
    isEmailVerified: false,
  });
  records.set(student.email, student);
  let res = response();
  await authController.resendOtp(request({ email: student.email }), res);
  assert.equal(res.statusCode, 200);
  assert.notEqual(student.otp, "111111");
  assert.equal(mailCalls, 1);

  student.isEmailVerified = true;
  res = response();
  await authController.resendOtp(request({ email: student.email }), res);
  assert.equal(res.statusCode, 400);
  assert.equal(mailCalls, 1);
});

test("forgot password reports missing users and email submission failures accurately", async () => {
  let res = response();
  await authController.forgotPassword(request({ email: "unknown@example.com" }), res);
  assert.equal(res.statusCode, 404);

  const student = saveableStudent({
    _id: "student-id",
    email: "student@example.com",
    password: "hashed:OldPass1!",
  });
  records.set(student.email, student);
  mailFailure = true;
  res = response();
  await authController.forgotPassword(request({ email: student.email }), res);
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.success, false);
  assert.match(student.otp, /^\d{6}$/);
});
