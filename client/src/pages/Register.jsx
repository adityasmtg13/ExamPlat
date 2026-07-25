import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../services/authService";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import {
  EMAIL_REGEX,
  NAME_REGEX,
  getPasswordStrength,
  getPasswordValidationErrors,
} from "../utils/validation";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!NAME_REGEX.test(form.name.trim())) {
      nextErrors.name = "Enter a valid full name. Only letters and spaces are allowed.";
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const passwordErrors = getPasswordValidationErrors(form.password, form.confirmPassword);
    if (passwordErrors.length > 0) {
      nextErrors.password = passwordErrors[0];
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please correct the highlighted validation issues.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerStudent(form);
      toast.success(`Hi ${res.data.student?.name || "User"} 👋`, {
        description: "Registration Successful",
        duration: 5000,
      });
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      const errorMessages = err.response?.data?.errors || [];
      if (errorMessages.length > 0) {
        errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || "Registration Failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900">
      <div className="w-[450px] rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-white px-4">
            <div className="flex items-center">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full rounded-xl p-3 outline-none"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {errors.name && <p className="pb-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="rounded-xl bg-white px-4">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full rounded-xl p-3 outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <p className="pb-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="rounded-xl bg-white px-4">
            <div className="flex items-center">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full rounded-xl p-3 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {errors.password && <p className="pb-2 text-sm text-red-600">{errors.password}</p>}
            {form.password && (
              <p className={`pb-2 text-sm ${passwordStrength.color}`}>
                Password Strength: {passwordStrength.label}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-white px-4">
            <div className="flex items-center">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full rounded-xl p-3 outline-none"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {errors.confirmPassword && <p className="pb-2 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?
          <Link to="/login" className="ml-2 text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;