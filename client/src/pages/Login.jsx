import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginStudent } from "../services/authService";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { setStudent } from "../storage";
import { EMAIL_REGEX } from "../utils/validation";
import logo from "../assets/logo.png";
import Button from "../components/Button";
import { isProfileComplete } from "../utils/profileUtils";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      nextErrors.password = "Password is required.";
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
      const res = await loginStudent(form);
      localStorage.setItem("token", res.data.token);
      setStudent(res.data.student);
      toast.success(`Hi ${res.data.student?.name || "User"} 👋`, {
        description: "Login Successful",
        duration: 5000,
      });

      if (isProfileComplete(res.data.student)) {
        const fromPath = location.state?.from?.pathname;
        navigate(fromPath || "/dashboard", { replace: true });
      } else {
        toast.info("Please complete your profile to continue.");
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ExamPlat logo"
              className="h-12 w-12 rounded-lg bg-white p-1.5"
            />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                ExamPlat
              </p>
              <h2 className="text-2xl font-bold">e-Examination Platform</h2>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Secure Student Access
            </p>
            <h1 className="text-5xl font-bold leading-tight">
              Continue your exam journey with confidence.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Sign in to view your dashboard, exam schedule, results, and official platform
              updates from one protected account.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">24/7</p>
              <p className="mt-1 text-slate-300">Portal access</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">100%</p>
              <p className="mt-1 text-slate-300">Secure login</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-cyan-300">Live</p>
              <p className="mt-1 text-slate-300">Exam updates</p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <img
                src={logo}
                alt="ExamPlat logo"
                className="h-12 w-12 rounded-lg bg-white p-1.5 shadow-sm"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  ExamPlat - e-Examination Platform
                </p>
                <h2 className="text-xl font-bold text-slate-950">ExamPlat - e-Examination Platform</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Student Login
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your registered email and password to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="Enter your password"
                      className="w-full bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-slate-950 p-3.5 text-white shadow-lg shadow-slate-300 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                >
                  {loading ? "Logging In..." : "Login"}
                </Button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-2 text-sm text-slate-500">
                <Link to="/forgot-password" className="font-semibold text-cyan-700 hover:text-cyan-800">
                  Forgot password?
                </Link>
                <p>
                  Don't have an account?
                  <Link to="/register" className="ml-2 font-semibold text-cyan-700 hover:text-cyan-800">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
