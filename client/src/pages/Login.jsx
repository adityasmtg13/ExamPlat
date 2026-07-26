import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginStudent } from "../services/authService";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { setStudent } from "../storage";
import { EMAIL_REGEX } from "../utils/validation";

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

      const fromPath = location.state?.from?.pathname;
      navigate(fromPath || "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900">
      <div className="w-[450px] rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-white px-4">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 p-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?
          <Link to="/register" className="ml-2 text-cyan-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;