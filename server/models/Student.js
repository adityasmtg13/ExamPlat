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
    },

    password: {
      type: String,
      required: true,
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
      default: null,
      unique: true,
      sparse: true,
    },

    fatherName: {
      type: String,
      default: "",
    },

    fatherPhone: {
      type: String,
      default: "",
    },

    fatherAadhaar: {
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

    motherAadhaar: {
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
      enum: ["", "JEE", "NEET", "CUET", "MAT"],
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