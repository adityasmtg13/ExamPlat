import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sendAccountSettingsOtp, verifyAccountSettingsOtp } from "../services/profileService";
import { setStudent } from "../storage";
import { getPasswordValidationErrors } from "../utils/validation";
import { logActivity } from "../services/auditService";

function Settings() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    logActivity("Viewed Settings");
  }, []);
  const [formData, setFormData] = useState({
    newEmail: "",
    newName: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [otpSent, setOtpSent] = useState(false);

  const passwordCriteria = [
    { id: "length", label: "At least 8 characters", isMet: formData.newPassword.length >= 8 },
    { id: "uppercase", label: "At least 1 uppercase letter", isMet: /[A-Z]/.test(formData.newPassword) },
    { id: "lowercase", label: "At least 1 lowercase letter", isMet: /[a-z]/.test(formData.newPassword) },
    { id: "numeric", label: "At least 1 numeric character", isMet: /\d/.test(formData.newPassword) },
    { id: "special", label: "At least 1 special character", isMet: /[!@#$%^&*()_+\-=?.]/.test(formData.newPassword) },
  ];

  const resetState = () => {
    setActiveAction(null);
    setFormData({ newEmail: "", newName: "", newPassword: "", confirmPassword: "", otp: "" });
    setOtpSent(false);
    setMessage({ type: "", text: "" });
  };

  const handleActionClick = (action) => {
    setActiveAction(action);
    setOtpSent(false);
    setMessage({ type: "", text: "" });
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (activeAction === "password") {
      const passwordErrors = getPasswordValidationErrors(formData.newPassword, formData.confirmPassword);
      if (passwordErrors.length > 0) {
        setMessage({ type: "error", text: passwordErrors[0] });
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        action: activeAction,
        newEmail: formData.newEmail,
        newName: formData.newName,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const response = await sendAccountSettingsOtp(payload);
      setOtpSent(true);
      setMessage({ type: "success", text: response.message || "OTP sent successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || "Unable to send OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await verifyAccountSettingsOtp({ action: activeAction, otp: formData.otp });
      if (activeAction === "delete") {
        localStorage.clear();
        navigate("/login", { replace: true });
      } else {
        setStudent(response.student);
        setMessage({ type: "success", text: response.message || "Updated successfully." });
        resetState();
      }
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || "OTP verification failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Account Settings
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Manage your account securely
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Change your email, name, password, or delete your account. Each action is protected with OTP verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
            >
              Back to profile
            </button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handleActionClick("email")}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
            >
              <p className="font-semibold text-slate-900">Change email</p>
              <p className="mt-1 text-sm text-slate-600">Verify a new email address with OTP.</p>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick("name")}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
            >
              <p className="font-semibold text-slate-900">Change name</p>
              <p className="mt-1 text-sm text-slate-600">Update your display name after OTP confirmation.</p>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick("password")}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
            >
              <p className="font-semibold text-slate-900">Change password</p>
              <p className="mt-1 text-sm text-slate-600">Set a new password with secure OTP verification.</p>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick("delete")}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-left transition hover:border-red-400"
            >
              <p className="font-semibold text-red-700">Delete account</p>
              <p className="mt-1 text-sm text-red-600">This action is permanent and requires OTP.</p>
            </button>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            {message.text ? (
              <div className={`mb-4 rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message.text}
              </div>
            ) : null}

            {!activeAction ? (
              <p className="text-sm text-slate-600">Choose an action to get started.</p>
            ) : (
              <div className="space-y-3">
                {activeAction === "email" && !otpSent ? (
                  <input
                    type="email"
                    value={formData.newEmail}
                    onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                    placeholder="Enter new email"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                ) : null}

                {activeAction === "name" && !otpSent ? (
                  <input
                    type="text"
                    value={formData.newName}
                    onChange={(e) => setFormData({ ...formData, newName: e.target.value })}
                    placeholder="Enter new full name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                ) : null}

                {activeAction === "password" && !otpSent ? (
                  <>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="New password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      required
                    />

                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Password Requirements
                      </p>
                      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        {passwordCriteria.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-2 transition-colors duration-200 ${
                              item.isMet ? "font-medium text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors duration-200 ${
                                item.isMet ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                              }`}
                            >
                              <FaCheck />
                            </span>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      required
                    />
                  </>
                ) : null}

                {otpSent ? (
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="Enter OTP"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={resetState}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Settings;
