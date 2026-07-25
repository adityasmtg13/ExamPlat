import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginStudent } from "../services/authService";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { setStudent } from "../storage";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await loginStudent(form);

      // Save JWT
      localStorage.setItem("token", res.data.token);

      // Save student details safely
      setStudent(res.data.student);

      toast.success(
          `Hi ${res.data.student?.name || "User"} 👋`,
          {
              description:"Login Successful",
              duration:5000,
          }
      );

      setTimeout(()=>{
          navigate("/dashboard");
      },5000);

      navigate("/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex justify-center items-center">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 w-[450px]">

        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaEnvelope className="text-gray-500" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 outline-none rounded-xl"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaLock className="text-gray-500" />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 outline-none rounded-xl"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-300 mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-cyan-400 ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;