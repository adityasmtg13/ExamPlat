import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import FormField from "../components/FormField";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../services/profileService";
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
  INDIAN_STATES,
  VALID_CLASSES,
  VALID_STREAMS,
} from "../utils/validation";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    alternateEmail: "",
    aadhaar: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    stream: "",
    studentClass: "",
    school: "",
    profilePhoto: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function fetchProfile() {
    try {
      const res = await getProfile();

      setProfile(res.student);
      localStorage.setItem("student", JSON.stringify(res.student));
      window.dispatchEvent(new Event("studentUpdated"));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateProfile = (values) => {
    const nextErrors = {};

    if (!values.name || !isValidName(values.name)) {
      nextErrors.name = "Enter a valid full name. Only letters and spaces are allowed.";
    }

    if (!values.email || !isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.phone || !isValidPhone(values.phone)) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!values.alternateEmail || !isValidEmail(values.alternateEmail)) {
      nextErrors.alternateEmail = "Enter a valid alternate email address.";
    }

    if (!values.aadhaar || !isValidAadhaar(values.aadhaar)) {
      nextErrors.aadhaar = "Enter a valid Aadhaar number. Aadhaar must contain exactly 12 digits.";
    }

    if (!values.fatherName || !isValidLetterName(values.fatherName)) {
      nextErrors.fatherName = "Enter a valid parent or guardian name.";
    }

    if (!values.fatherPhone || !isValidPhone(values.fatherPhone)) {
      nextErrors.fatherPhone = "Enter a valid 10-digit parent contact number.";
    }

    if (!values.motherName || !isValidLetterName(values.motherName)) {
      nextErrors.motherName = "Enter a valid mother's name.";
    }

    if (!values.motherPhone || !isValidPhone(values.motherPhone)) {
      nextErrors.motherPhone = "Enter a valid 10-digit mother's contact number.";
    }

    if (!values.dob || !isValidDob(values.dob)) {
      nextErrors.dob = "Enter a valid date of birth.";
    }

    if (!values.gender) {
      nextErrors.gender = "Please select your gender.";
    }

    if (!values.address || !isValidAddress(values.address)) {
      nextErrors.address = "Enter your complete address.";
    }

    if (!values.city || !isValidCity(values.city)) {
      nextErrors.city = "Enter a valid city name.";
    }

    if (!values.state || !INDIAN_STATES.includes(values.state)) {
      nextErrors.state = "Please select your state.";
    }

    if (!values.country || values.country !== "India") {
      nextErrors.country = "Country is required.";
    }

    if (!values.pincode || !isValidPincode(values.pincode)) {
      nextErrors.pincode = "Enter a valid 6-digit PIN code.";
    }

    if (!values.stream || !VALID_STREAMS.includes(values.stream)) {
      nextErrors.stream = "Please select your stream.";
    }

    if (!values.studentClass || !VALID_CLASSES.includes(values.studentClass)) {
      nextErrors.studentClass = "Please select your class.";
    }

    if (!values.school || !isValidSchool(values.school)) {
      nextErrors.school = "Enter a valid school or college name.";
    }

    if (!values.profilePhoto) {
      nextErrors.profilePhoto = "Please upload your profile photo.";
    }

    return nextErrors;
  };

  const validateField = (name, value) => {
    const nextError = {};
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "name":
        nextError.name =
          trimmedValue && isValidName(trimmedValue)
            ? ""
            : "Enter a valid full name. Only letters and spaces are allowed.";
        break;
      case "email":
        nextError.email =
          trimmedValue && isValidEmail(trimmedValue) ? "" : "Enter a valid email address.";
        break;
      case "phone":
        nextError.phone =
          trimmedValue && isValidPhone(trimmedValue)
            ? ""
            : "Enter a valid 10-digit mobile number.";
        break;
      case "alternateEmail":
        nextError.alternateEmail =
          trimmedValue && isValidEmail(trimmedValue)
            ? ""
            : "Enter a valid alternate email address.";
        break;
      case "aadhaar":
        nextError.aadhaar =
          trimmedValue && isValidAadhaar(trimmedValue)
            ? ""
            : "Enter a valid Aadhaar number. Aadhaar must contain exactly 12 digits.";
        break;
      case "fatherName":
        nextError.fatherName =
          trimmedValue && isValidLetterName(trimmedValue)
            ? ""
            : "Enter a valid parent or guardian name.";
        break;
      case "fatherPhone":
        nextError.fatherPhone =
          trimmedValue && isValidPhone(trimmedValue)
            ? ""
            : "Enter a valid 10-digit parent contact number.";
        break;
      case "motherName":
        nextError.motherName =
          trimmedValue && isValidLetterName(trimmedValue) ? "" : "Enter a valid mother's name.";
        break;
      case "motherPhone":
        nextError.motherPhone =
          trimmedValue && isValidPhone(trimmedValue)
            ? ""
            : "Enter a valid 10-digit mother's contact number.";
        break;
      case "dob":
        nextError.dob =
          trimmedValue && isValidDob(trimmedValue) ? "" : "Enter a valid date of birth.";
        break;
      case "gender":
        nextError.gender = trimmedValue ? "" : "Please select your gender.";
        break;
      case "address":
        nextError.address =
          trimmedValue && isValidAddress(trimmedValue) ? "" : "Enter your complete address.";
        break;
      case "city":
        nextError.city =
          trimmedValue && isValidCity(trimmedValue) ? "" : "Enter a valid city name.";
        break;
      case "state":
        nextError.state =
          trimmedValue && INDIAN_STATES.includes(trimmedValue) ? "" : "Please select your state.";
        break;
      case "country":
        nextError.country = trimmedValue === "India" ? "" : "Country is required.";
        break;
      case "pincode":
        nextError.pincode =
          trimmedValue && isValidPincode(trimmedValue) ? "" : "Enter a valid 6-digit PIN code.";
        break;
      case "stream":
        nextError.stream =
          trimmedValue && VALID_STREAMS.includes(trimmedValue) ? "" : "Please select your stream.";
        break;
      case "studentClass":
        nextError.studentClass =
          trimmedValue && VALID_CLASSES.includes(trimmedValue) ? "" : "Please select your class.";
        break;
      case "school":
        nextError.school =
          trimmedValue && isValidSchool(trimmedValue)
            ? ""
            : "Enter a valid school or college name.";
        break;
      case "profilePhoto":
        nextError.profilePhoto = trimmedValue ? "" : "Please upload your profile photo.";
        break;
      default:
        break;
    }

    return nextError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = value;

    setProfile((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    const fieldError = validateField(name, nextValue);
    setErrors((prev) => ({
      ...prev,
      ...fieldError,
      [name]: fieldError[name] || "",
    }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const res = await uploadProfilePhoto(file);

      setProfile(res.student);
      setErrors((prev) => ({ ...prev, profilePhoto: "" }));
      localStorage.setItem("student", JSON.stringify(res.student));
      window.dispatchEvent(new Event("studentUpdated"));
      toast.success("Profile Photo Updated");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Photo upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProfile(profile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please complete all required profile fields before saving.");
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile(profile);

      setProfile(res.student);
      localStorage.setItem("student", JSON.stringify(res.student));
      window.dispatchEvent(new Event("studentUpdated"));
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 text-center shadow-md shadow-slate-200/70">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700" />
            <h2 className="text-xl font-bold text-slate-950">Loading Profile</h2>
            <p className="mt-2 text-sm text-slate-500">Retrieving your student record.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Student Records
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">Student Profile</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Keep your personal, guardian, address, and academic details accurate before
                  examination registration.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Record Status
                </p>
                <p className="mt-2 font-semibold text-cyan-200">Verification details required</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[280px_1fr] sm:p-8">
            <aside>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <img
                  src={
                    profile.profilePhoto
                      ? profile.profilePhoto
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="mx-auto h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                />

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {profile.name || "Student"}
                </h2>
                <p className="mt-1 break-words text-sm text-slate-500">
                  {profile.email || "No email provided"}
                </p>

                <label className="mt-5 inline-block">
                  <input type="file" className="hidden" onChange={handlePhoto} />

                  <span className="cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-cyan-700">
                    Change Profile Photo
                  </span>
                </label>
                {errors.profilePhoto && (
                  <p className="mt-3 text-sm text-red-600">{errors.profilePhoto}</p>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Academic
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500">Stream</span>
                    <span className="font-semibold text-slate-950">{profile.stream || "--"}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500">Class</span>
                    <span className="font-semibold text-slate-950">
                      {profile.studentClass || "--"}
                    </span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500">State</span>
                    <span className="font-semibold text-slate-950">{profile.state || "--"}</span>
                  </p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <div className="mb-5 border-b border-slate-200 pb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Personal Details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Identity Information</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={profile.name || ""}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    disabled
                    error={errors.name}
                  />

                  <FormField
                    label="Email"
                    name="email"
                    value={profile.email || ""}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    disabled
                    error={errors.email}
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    error={errors.phone}
                  />

                  <FormField
                    label="Alternate Email"
                    name="alternateEmail"
                    value={profile.alternateEmail || ""}
                    onChange={handleChange}
                    placeholder="Alternate Email"
                    required
                    error={errors.alternateEmail}
                  />

                  <FormField
                    label="Aadhaar Number"
                    name="aadhaar"
                    value={profile.aadhaar || ""}
                    onChange={handleChange}
                    placeholder="Aadhaar Number"
                    required
                    error={errors.aadhaar}
                  />

                  <FormField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={profile.dob ? profile.dob.split("T")[0] : ""}
                    onChange={handleChange}
                    required
                    error={errors.dob}
                  />

                  <FormField
                    label="Gender"
                    name="gender"
                    type="select"
                    value={profile.gender || ""}
                    onChange={handleChange}
                    required
                    error={errors.gender}
                    options={[
                      { value: "", label: "Select Gender" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              </section>

              <section>
                <div className="mb-5 border-b border-slate-200 pb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Guardian Details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Parent Information</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Parent/Guardian Name"
                    name="fatherName"
                    value={profile.fatherName || ""}
                    onChange={handleChange}
                    placeholder="Parent/Guardian Name"
                    required
                    error={errors.fatherName}
                  />

                  <FormField
                    label="Parent Contact Number"
                    name="fatherPhone"
                    value={profile.fatherPhone || ""}
                    onChange={handleChange}
                    placeholder="Parent Contact Number"
                    required
                    error={errors.fatherPhone}
                  />

                  <FormField
                    label="Mother Name"
                    name="motherName"
                    value={profile.motherName || ""}
                    onChange={handleChange}
                    placeholder="Mother Name"
                    required
                    error={errors.motherName}
                  />

                  <FormField
                    label="Mother Phone"
                    name="motherPhone"
                    value={profile.motherPhone || ""}
                    onChange={handleChange}
                    placeholder="Mother Phone"
                    required
                    error={errors.motherPhone}
                  />
                </div>
              </section>

              <section>
                <div className="mb-5 border-b border-slate-200 pb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Address Details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Communication Address</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Address"
                    name="address"
                    value={profile.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    error={errors.address}
                    fullWidth
                  />

                  <FormField
                    label="City"
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    error={errors.city}
                  />

                  <FormField
                    label="State"
                    name="state"
                    type="select"
                    value={profile.state || ""}
                    onChange={handleChange}
                    required
                    error={errors.state}
                    options={[
                      { value: "", label: "Select State" },
                      ...INDIAN_STATES.map((state) => ({ value: state, label: state })),
                    ]}
                  />

                  <FormField
                    label="Country"
                    name="country"
                    value={profile.country || "India"}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    error={errors.country}
                  />

                  <FormField
                    label="Pincode"
                    name="pincode"
                    value={profile.pincode || ""}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                    error={errors.pincode}
                  />
                </div>
              </section>

              <section>
                <div className="mb-5 border-b border-slate-200 pb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Academic Details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">School Information</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Stream"
                    name="stream"
                    type="select"
                    value={profile.stream || ""}
                    onChange={handleChange}
                    required
                    error={errors.stream}
                    options={[
                      { value: "", label: "Select Stream" },
                      { value: "JEE", label: "JEE" },
                      { value: "NEET", label: "NEET" },
                      { value: "CUET", label: "CUET" },
                      { value: "MAT", label: "MAT" },
                    ]}
                  />

                  <FormField
                    label="Class"
                    name="studentClass"
                    type="select"
                    value={profile.studentClass || ""}
                    onChange={handleChange}
                    required
                    error={errors.studentClass}
                    options={[
                      { value: "", label: "Select Class" },
                      { value: "11", label: "11" },
                      { value: "12", label: "12" },
                      { value: "Dropper", label: "Dropper" },
                    ]}
                  />

                  <FormField
                    label="School/College Name"
                    name="school"
                    value={profile.school || ""}
                    onChange={handleChange}
                    placeholder="School / College"
                    required
                    error={errors.school}
                    fullWidth
                  />
                </div>
              </section>

              <div className="sticky bottom-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-300/60 backdrop-blur">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-slate-950 py-3.5 font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
