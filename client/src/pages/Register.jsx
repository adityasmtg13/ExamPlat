import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../services/authService";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaIdCard,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    aadhaar: "",
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
      await registerStudent(form);

      alert("Registration Successful!");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
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
              name="fullName"
              placeholder="Full Name"
              className="w-full p-3 outline-none rounded-xl"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaEnvelope className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 outline-none rounded-xl"
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
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaPhone className="text-gray-500" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 outline-none rounded-xl"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-xl px-4">
            <FaIdCard className="text-gray-500" />
            <input
              type="text"
              name="aadhaar"
              placeholder="Aadhaar Number"
              className="w-full p-3 outline-none rounded-xl"
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
            className="text-cyan-400 ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;