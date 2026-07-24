const Student = require("../models/Student");

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

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      {
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
        country: req.body.country,
        pincode: req.body.pincode,
        stream: req.body.stream,
        studentClass: req.body.studentClass,
        school: req.body.school,
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