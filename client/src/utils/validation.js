export const NAME_REGEX = /^[A-Za-z ]{3,80}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const AADHAAR_REGEX = /^\d{12}$/;
export const PINCODE_REGEX = /^\d{6}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=?.])[A-Za-z\d!@#$%^&*()_+\-=?.]{8,32}$/;
export const VALID_STREAMS = ["JEE", "NEET", "CUET", "MAT"];
export const VALID_CLASSES = ["10", "11", "12", "Dropper"];
export const INDIAN_STATES = [
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

export const isValidName = (value) => NAME_REGEX.test(value);
export const isValidEmail = (value) => EMAIL_REGEX.test(value);
export const isValidPhone = (value) => PHONE_REGEX.test(value);
export const isValidAadhaar = (value) => AADHAAR_REGEX.test(value);
export const isValidPincode = (value) => PINCODE_REGEX.test(value);
export const isValidPassword = (value) => PASSWORD_REGEX.test(value);
export const isValidLetterName = (value) => /^[A-Za-z ]+$/.test(value);
export const isValidCity = (value) => /^[A-Za-z ]+$/.test(value);
export const isValidAddress = (value) => value && value.trim().length >= 15 && value.trim().length <= 250;
export const isValidSchool = (value) => value && value.trim().length >= 3;
export const isValidDob = (value) => {
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
export const getPasswordStrength = (value) => {
  if (!value) return { label: "Weak", color: "text-red-600" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/^[A-Za-z\d!@#$%^&*()_+\-=?.]{8,32}$/.test(value) && /[!@#$%^&*()_+\-=?.]/.test(value)) score += 1;
  if (score <= 2) return { label: "Weak", color: "text-red-600" };
  if (score <= 4) return { label: "Medium", color: "text-amber-600" };
  return { label: "Strong", color: "text-green-600" };
};

export const getPasswordValidationErrors = (value, confirmValue = "") => {
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
