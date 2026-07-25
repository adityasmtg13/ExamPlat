const NAME_REGEX = /^[A-Za-z ]{3,80}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PINCODE_REGEX = /^\d{6}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=?.])[A-Za-z\d!@#$%^&*()_+\-=?.]{8,32}$/;

const VALID_STREAMS = ["JEE", "NEET", "CUET", "MAT"];
const VALID_CLASSES = ["10", "11", "12", "Dropper"];
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const isValidName = (value) => NAME_REGEX.test(value);
const isValidEmail = (value) => EMAIL_REGEX.test(value);
const isValidPhone = (value) => PHONE_REGEX.test(value);
const isValidAadhaar = (value) => AADHAAR_REGEX.test(value);
const isValidPincode = (value) => PINCODE_REGEX.test(value);
const isValidPassword = (value) => PASSWORD_REGEX.test(value);
const getPasswordValidationErrors = (value, confirmValue = "") => {
  const errors = [];

  if (!value) {
    errors.push("Password is required.");
    return errors;
  }

  if (value.length < 8 || value.length > 32) {
    errors.push("Password must be between 8 and 32 characters.");
  }

  if (!/[A-Z]/.test(value)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(value)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/\d/.test(value)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[!@#$%^&*()_+\-=?.]/.test(value)) {
    errors.push("Password must contain at least one special character.");
  }

  if (confirmValue !== undefined && confirmValue !== "" && value !== confirmValue) {
    errors.push("Passwords do not match.");
  }

  return errors;
};
const isValidAddress = (value) => value && value.trim().length >= 15 && value.trim().length <= 250;
const isValidSchool = (value) => value && value.trim().length >= 3;
const isValidCity = (value) => /^[A-Za-z ]+$/.test(value);
const isValidLetterName = (value) => /^[A-Za-z ]+$/.test(value);
const isValidDob = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  const computedAge = age - (hasBirthdayPassed ? 1 : 0);
  return date <= today && computedAge >= 15 && computedAge <= 30;
};

const isProfileComplete = (student = {}) => {
  if (!student) return false;
  const fields = [
    { key: "name", validate: isValidName },
    { key: "email", validate: isValidEmail },
    { key: "phone", validate: isValidPhone },
    { key: "alternateEmail", validate: isValidEmail },
    { key: "aadhaar", validate: isValidAadhaar },
    { key: "fatherName", validate: isValidLetterName },
    { key: "fatherPhone", validate: isValidPhone },
    { key: "motherName", validate: isValidLetterName },
    { key: "motherPhone", validate: isValidPhone },
    { key: "dob", validate: isValidDob },
    { key: "gender" },
    { key: "address", validate: isValidAddress },
    { key: "city", validate: isValidCity },
    { key: "state" },
    { key: "country" },
    { key: "pincode", validate: isValidPincode },
    { key: "stream" },
    { key: "studentClass" },
    { key: "school", validate: isValidSchool },
    { key: "profilePhoto" },
  ];

  return fields.every(({ key, validate }) => {
    const value = typeof student[key] === "string" ? student[key].trim() : student[key];
    if (!value) return false;
    if (validate) return validate(value);
    if (key === "gender") return ["Male", "Female", "Other"].includes(value);
    if (key === "country") return value === "India";
    if (key === "stream") return VALID_STREAMS.includes(value);
    if (key === "studentClass") return VALID_CLASSES.includes(value);
    return true;
  });
};

module.exports = {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  AADHAAR_REGEX,
  PINCODE_REGEX,
  PASSWORD_REGEX,
  VALID_STREAMS,
  VALID_CLASSES,
  INDIAN_STATES,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidAadhaar,
  isValidPincode,
  isValidPassword,
  getPasswordValidationErrors,
  isValidAddress,
  isValidSchool,
  isValidCity,
  isValidLetterName,
  isValidDob,
  isProfileComplete,
};
