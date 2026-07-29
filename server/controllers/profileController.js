const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const transporter = require("../utils/mailSender");
const {
  isValidAddress,
  isValidAadhaar,
  isValidCity,
  isValidDob,
  isValidEmail,
  isValidLetterName,
  isValidName,
  isValidPhone,
  isValidPincode,
  isValidSchool,
  INDIAN_STATES,
  VALID_CLASSES,
  VALID_STREAMS,
  isProfileComplete,
  getPasswordValidationErrors,
} = require("../utils/validation");

// Get Student Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const validateProfilePayload = (payload) => {
  const errors = {};

  if (!payload.name || !isValidName(payload.name)) {
    errors.name = "Enter a valid full name. Only letters and spaces are allowed.";
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.phone || !isValidPhone(payload.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }

  if (!payload.alternateEmail || !isValidEmail(payload.alternateEmail)) {
    errors.alternateEmail = "Enter a valid alternate email address.";
  }

  if (!payload.aadhaar || !isValidAadhaar(payload.aadhaar)) {
    errors.aadhaar = "Enter a valid Aadhaar number. Aadhaar must contain exactly 12 digits.";
  }

  if (!payload.fatherName || !isValidLetterName(payload.fatherName)) {
    errors.fatherName = "Enter a valid parent or guardian name.";
  }

  if (!payload.fatherPhone || !isValidPhone(payload.fatherPhone)) {
    errors.fatherPhone = "Enter a valid 10-digit parent contact number.";
  }

  if (!payload.motherName || !isValidLetterName(payload.motherName)) {
    errors.motherName = "Enter a valid mother's name.";
  }

  if (!payload.motherPhone || !isValidPhone(payload.motherPhone)) {
    errors.motherPhone = "Enter a valid 10-digit mother's contact number.";
  }

  if (!payload.dob || !isValidDob(payload.dob)) {
    errors.dob = "Enter a valid date of birth.";
  }

  if (!payload.gender || !["Male", "Female", "Other"].includes(payload.gender)) {
    errors.gender = "Please select your gender.";
  }

  if (!payload.address || !isValidAddress(payload.address)) {
    errors.address = "Enter your complete address.";
  }

  if (!payload.city || !isValidCity(payload.city)) {
    errors.city = "Enter a valid city name.";
  }

  if (!payload.state || !INDIAN_STATES.includes(payload.state)) {
    errors.state = "Please select your state.";
  }

  if (!payload.country || payload.country !== "India") {
    errors.country = "Country is required.";
  }

  if (!payload.pincode || !isValidPincode(payload.pincode)) {
    errors.pincode = "Enter a valid 6-digit PIN code.";
  }

  if (!payload.stream || !VALID_STREAMS.includes(payload.stream)) {
    errors.stream = "Please select your stream.";
  }

  if (!payload.studentClass || !VALID_CLASSES.includes(payload.studentClass)) {
    errors.studentClass = "Please select your class.";
  }

  if (!payload.school || !isValidSchool(payload.school)) {
    errors.school = "Enter a valid school or college name.";
  }

  if (!payload.profilePhoto) {
    errors.profilePhoto = "Please upload your profile photo.";
  }

  return errors;
};

exports.sendAccountSettingsOtp = async (req, res) => {
  try {
    const { action, newEmail, newName, newPassword, confirmPassword } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Please select an account setting action.",
      });
    }

    const student = await Student.findById(req.student._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const normalizedEmail = (newEmail || "").trim().toLowerCase();
    const normalizedName = (newName || "").trim();

    if (action === "email") {
      if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid new email address.",
        });
      }

      if (normalizedEmail === student.email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: "The new email must be different from your current email.",
        });
      }

      const existingStudent = await Student.findOne({
        email: normalizedEmail,
        _id: { $ne: student._id },
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "This email is already in use by another student.",
        });
      }
    }

    if (action === "name") {
      if (!normalizedName || !isValidName(normalizedName)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid full name.",
        });
      }
    }

    if (action === "password") {
      const passwordErrors = getPasswordValidationErrors(newPassword, confirmPassword);
      if (passwordErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Please fix the password errors.",
          errors: passwordErrors,
        });
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    student.otp = otp;
    student.otpExpiresAt = otpExpiresAt;
    student.pendingAction = action;
    student.pendingEmail = action === "email" ? normalizedEmail : null;
    student.pendingName = action === "name" ? normalizedName : null;
    student.pendingPasswordHash = action === "password" ? await bcrypt.hash(newPassword, 10) : null;

    await student.save();

    const recipients = [action === "email" ? normalizedEmail : student.email, process.env.BREVO_TO_EMAIL].filter(Boolean);
    const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";

    try {
      await transporter.sendMail({
        from: `"ExamPlat" <${senderAddress}>`,
        to: recipients,
        subject: action === "email"
          ? "Verify your new Email Address"
          : action === "password"
            ? "Verify your password change"
            : action === "delete"
              ? "Confirm account deletion"
              : "Verify your name change",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #0f4c81;">Account update request</h2>
            <p>Use the OTP below to verify this ${action === "email" ? "email change" : action === "password" ? "password change" : action === "delete" ? "deletion request" : "name change"}.</p>
            <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</div>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });
      console.log(`Settings OTP email sent to: ${recipients.join(", ")}`);
    } catch (mailError) {
      console.error("Settings OTP email failed:", mailError);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify it to continue.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyAccountSettingsOtp = async (req, res) => {
  try {
    const { action, otp } = req.body;

    if (!action || !otp) {
      return res.status(400).json({
        success: false,
        message: "Action and OTP are required.",
      });
    }

    const student = await Student.findById(req.student._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.otp !== otp || new Date(student.otpExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    if (student.pendingAction !== action) {
      return res.status(400).json({
        success: false,
        message: "This OTP is not valid for the selected action.",
      });
    }

    if (action === "delete") {
      await Student.findByIdAndDelete(req.student._id);

      return res.status(200).json({
        success: true,
        message: "Account deleted successfully.",
      });
    }

    if (action === "email") {
      student.email = student.pendingEmail;
      student.isEmailVerified = true;
    } else if (action === "name") {
      student.name = student.pendingName;
    } else if (action === "password") {
      student.password = student.pendingPasswordHash;
    }

    student.pendingAction = null;
    student.pendingEmail = null;
    student.pendingName = null;
    student.pendingPasswordHash = null;
    student.otp = null;
    student.otpExpiresAt = null;
    await student.save();

    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: action === "email"
        ? "Email updated successfully."
        : action === "name"
          ? "Name updated successfully."
          : "Password updated successfully.",
      student: studentData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      alternateEmail: req.body.alternateEmail,
      aadhaar: req.body.aadhaar,
      fatherName: req.body.fatherName,
      fatherPhone: req.body.fatherPhone,
      motherName: req.body.motherName,
      motherPhone: req.body.motherPhone,
      dob: req.body.dob || null,
      gender: req.body.gender,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || "India",
      pincode: req.body.pincode,
      stream: req.body.stream,
      studentClass: req.body.studentClass,
      school: req.body.school,
      profilePhoto: req.body.profilePhoto || "",
    };

    const validationErrors = validateProfilePayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required profile fields correctly.",
        errors: validationErrors,
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        alternateEmail: payload.alternateEmail,
        aadhaar: payload.aadhaar,
        fatherName: payload.fatherName,
        fatherPhone: payload.fatherPhone,
        motherName: payload.motherName,
        motherPhone: payload.motherPhone,
        dob: payload.dob || null,
        gender: payload.gender,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        pincode: payload.pincode,
        stream: payload.stream,
        studentClass: payload.studentClass,
        school: payload.school,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const profileIsComplete = isProfileComplete(updatedStudent.toObject());
    if (!profileIsComplete) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required profile fields correctly.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Upload Profile Photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      {
        profilePhoto: req.file.path,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Profile Photo
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      {
        profilePhoto: "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};