import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../services/authService";
import { toast } from "sonner";

import {
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const res = await registerStudent(form);

      toast.success(
          `Hi ${res.data.student?.name || "User"} 👋`,
          {
              description:"Registration Successful",
              duration:5000,
          }
      );

      setTimeout(()=>{
          navigate("/login");
      },5000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 w-[450px]">

        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaUser className="text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 outline-none rounded-xl"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaEnvelope className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
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
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;