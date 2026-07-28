const crypto = require("crypto");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailSender");
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
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isEmailVerified: false,
    });

    try {
      const recipients = [email, process.env.BREVO_TO_EMAIL].filter(Boolean);
      const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";
      await transporter.sendMail({
        from: `"ExamPlat" <${senderAddress}>`,
        to: recipients,
        subject: "Verify your ExamPlat account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #0f4c81;">Welcome to ExamPlat</h2>
            <p>Use the OTP below to verify your email address and complete your registration.</p>
            <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</div>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });
      console.log(`OTP email sent to: ${recipients.join(", ")}`);
    } catch (mailError) {
      console.error("OTP email failed:", mailError);
    }

    const studentData = student.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: "Registration Successful. Please verify your email using the OTP sent to your inbox.",
      student: studentData,
    });
  } catch (err) {
    const duplicateField = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
    let message = err.message;

    if (err?.code === 11000) {
      if (duplicateField === "email") {
        message = "Student already exists";
      } else if (duplicateField === "aadhaar") {
        message = "A student with this Aadhaar already exists.";
      } else {
        message = "Registration failed due to a duplicate field.";
      }
    }

    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified.",
      });
    }

    if (student.otp !== otp || new Date(student.otpExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    student.isEmailVerified = true;
    student.otp = null;
    student.otpExpiresAt = null;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    student.otp = otp;
    student.otpExpiresAt = otpExpiresAt;
    student.isEmailVerified = false;
    await student.save();

    const recipients = [email, process.env.BREVO_TO_EMAIL].filter(Boolean);
    const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";
    await transporter.sendMail({
      from: `"ExamPlat" <${senderAddress}>`,
      to: recipients,
      subject: "Your ExamPlat OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0f4c81;">New verification code</h2>
          <p>Use the OTP below to continue.</p>
          <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });
    console.log(`Resend OTP email sent to: ${recipients.join(", ")}`);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    student.otp = otp;
    student.otpExpiresAt = otpExpiresAt;
    await student.save();

    const recipients = [email, process.env.BREVO_TO_EMAIL].filter(Boolean);
    const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";
    await transporter.sendMail({
      from: `"ExamPlat" <${senderAddress}>`,
      to: recipients,
      subject: "Reset your ExamPlat password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0f4c81;">Password reset request</h2>
          <p>Use the OTP below to reset your password.</p>
          <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });
    console.log(`Password reset OTP email sent to: ${recipients.join(", ")}`);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required.",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.otp !== otp || new Date(student.otpExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    student.password = await bcrypt.hash(password, 10);
    student.otp = null;
    student.otpExpiresAt = null;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
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