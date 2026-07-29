const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Authentication
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Primary unique identifier for student authentication
    },

    password: {
      type: String,
      required: true,
    },

    pendingAction: {
      type: String,
      default: null,
    },

    pendingEmail: {
      type: String,
      default: null,
    },

    pendingName: {
      type: String,
      default: null,
    },

    pendingPasswordHash: {
      type: String,
      default: null,
    },

    // Profile
    profilePhoto: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    alternateEmail: {
      type: String,
      default: "",
    },

    aadhaar: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    fatherName: {
      type: String,
      default: "",
    },

    fatherPhone: {
      type: String,
      default: "",
    },

    motherName: {
      type: String,
      default: "",
    },

    motherPhone: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
    },

    stream: {
      type: String,
      enum: ["", "JEE", "NEET"],
      default: "",
    },

    studentClass: {
      type: String,
      enum: ["", "11", "12", "Dropper"],
      default: "",
    },

    school: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);