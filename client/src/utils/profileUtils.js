import {
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
  VALID_CLASSES,
  VALID_STREAMS,
} from "./validation";

const REQUIRED_PROFILE_FIELDS = [
  { key: "name", label: "Full Name", validate: isValidName },
  { key: "email", label: "Email", validate: isValidEmail },
  { key: "phone", label: "Phone Number", validate: isValidPhone },
  { key: "alternateEmail", label: "Alternate Email", validate: isValidEmail },
  { key: "aadhaar", label: "Aadhaar Number", validate: isValidAadhaar },
  { key: "fatherName", label: "Parent/Guardian Name", validate: isValidLetterName },
  { key: "fatherPhone", label: "Parent Contact Number", validate: isValidPhone },
  { key: "motherName", label: "Mother Name", validate: isValidLetterName },
  { key: "motherPhone", label: "Mother Phone", validate: isValidPhone },
  { key: "dob", label: "Date of Birth", validate: isValidDob },
  { key: "gender", label: "Gender" },
  { key: "address", label: "Address", validate: isValidAddress },
  { key: "city", label: "City", validate: isValidCity },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "pincode", label: "Pincode", validate: isValidPincode },
  { key: "stream", label: "Stream" },
  { key: "studentClass", label: "Class" },
  { key: "school", label: "School/College Name", validate: isValidSchool },
  { key: "profilePhoto", label: "Profile Photo" },
];

export const isProfileComplete = (student = {}) => {
  if (!student) return false;

  return REQUIRED_PROFILE_FIELDS.every(({ key, validate }) => {
    const value = typeof student[key] === "string" ? student[key].trim() : student[key];

    if (!value) return false;
    if (validate) return validate(value);

    if (key === "gender") {
      return ["Male", "Female", "Other"].includes(value);
    }

    if (key === "state") {
      return Boolean(value);
    }

    if (key === "country") {
      return value === "India";
    }

    if (key === "stream") {
      return VALID_STREAMS.includes(value);
    }

    if (key === "studentClass") {
      return VALID_CLASSES.includes(value);
    }

    return true;
  });
};

export const getRequiredProfileFieldLabels = () => REQUIRED_PROFILE_FIELDS.map(({ label }) => label);
