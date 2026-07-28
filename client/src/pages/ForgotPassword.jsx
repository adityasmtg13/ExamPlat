import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../assets/logo.png";
import Button from "../components/Button";
import { EMAIL_REGEX } from "../utils/validation";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email: email.trim() });
      toast.success(res.data.message || "OTP sent to your email.");
      setStep("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ email: email.trim(), otp, password });
      toast.success(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExamPlat logo" className="h-12 w-12 rounded-lg bg-white p-1.5" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">ExamPlat</p>
              <h2 className="text-2xl font-bold">e-Examination Platform</h2>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Password recovery</p>
            <h1 className="text-5xl font-bold leading-tight">Reset your password securely in minutes.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Enter your registered email, verify the OTP, and set a new password without any hassle.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">Forgot password</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">Reset your account password</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step === "email"
                    ? "We will send an OTP to your registered email address."
                    : "Enter the OTP sent to your email and choose a new password."}
                </p>
              </div>

              {step === "email" ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                      <FaEnvelope className="text-slate-400" />
                      <input
                        type="email"
                        placeholder="student@example.com"
                        className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full bg-slate-950 p-3.5 text-white shadow-lg shadow-slate-300 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">OTP</label>
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                      <FaLock className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Create a strong password"
                        className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                      <FaLock className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Re-enter your password"
                        className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full bg-slate-950 p-3.5 text-white shadow-lg shadow-slate-300 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              <p className="mt-8 text-center text-sm text-slate-500">
                Remembered your password?
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

export default ForgotPassword;
