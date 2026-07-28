import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent, resendOtp, verifyOtp } from "../services/authService";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import {
  EMAIL_REGEX,
  NAME_REGEX,
  getPasswordStrength,
  getPasswordValidationErrors,
} from "../utils/validation";
import logo from "../assets/logo.png";
import Button from "../components/Button";

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
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

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
      setRegisteredEmail(form.email);
      setOtpStep(true);
      toast.success(res.data.message || "Registration Successful", {
        description: "Please verify your email with the OTP sent to your inbox.",
        duration: 5000,
      });
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ email: registeredEmail, otp });
      toast.success(res.data.message || "Email verified successfully.");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registeredEmail) {
      toast.error("Please register again to receive a fresh OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await resendOtp({ email: registeredEmail });
      toast.success(res.data.message || "OTP resent successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="National Exam Platform logo"
              className="h-12 w-12 rounded-lg bg-white p-1.5"
            />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                National
              </p>
              <h2 className="text-2xl font-bold">Exam Platform</h2>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Student Registration
            </p>
            <h1 className="text-5xl font-bold leading-tight">
              Create your official student access account.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Register once to manage exam applications, receive platform notifications, and
              access your student dashboard securely.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">01</p>
              <p className="mt-1 text-slate-300">Create profile</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">02</p>
              <p className="mt-1 text-slate-300">Verify details</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">03</p>
              <p className="mt-1 text-slate-300">Start exams</p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <img
                src={logo}
                alt="National Exam Platform logo"
                className="h-12 w-12 rounded-lg bg-white p-1.5 shadow-sm"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  National
                </p>
                <h2 className="text-xl font-bold text-slate-950">Exam Platform</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  New Student Account
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">Create account</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use your official details to register for the National Exam Platform.
                </p>
              </div>

              {otpStep ? (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      We sent a 6-digit code to {registeredEmail}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full bg-slate-950 p-3.5 text-white shadow-lg shadow-slate-300 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    loading={loading}
                    className="w-full border border-slate-200 bg-white p-3.5 text-slate-700 hover:border-cyan-500 hover:text-cyan-700"
                  >
                    {loading ? "Resending..." : "Resend OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                    <FaUser className="text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                    <FaEnvelope className="text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                    <FaLock className="text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a strong password"
                      className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  {form.password && (
                    <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                      <p className={`text-sm font-medium ${passwordStrength.color}`}>
                        Password Strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                    <FaLock className="text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-slate-950 p-3.5 text-white shadow-lg shadow-slate-300 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
              )}

              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?
                <Link to="/login" className="ml-2 font-semibold text-cyan-700 hover:text-cyan-800">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;
