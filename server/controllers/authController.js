const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidEmail, isValidName, getPasswordValidationErrors } = require("../utils/validation");

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const errors = [];

    if (!name || !isValidName(name)) {
      errors.push("Enter a valid full name. Only letters and spaces are allowed.");
    }

    if (!email || !isValidEmail(email)) {
      errors.push("Enter a valid email address.");
    }

    if (!password) {
      errors.push("Password is required.");
    } else {
      errors.push(...getPasswordValidationErrors(password, confirmPassword));
    }

    if (confirmPassword === undefined || confirmPassword === "") {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the highlighted registration errors.",
        errors,
      });
    }

    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    const studentData = student.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      student: studentData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      student: studentData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};