import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link
          to="/dashboard"
          className="text-3xl font-bold tracking-wide"
        >
          AI Exam Prep Platform
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <Link
            to="/dashboard"
            className="hover:text-cyan-300 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/mock-tests"
            className="hover:text-cyan-300 transition"
          >
            Mock Tests
          </Link>

          <Link
            to="/analytics"
            className="hover:text-cyan-300 transition"
          >
            Analytics
          </Link>

          <Link
            to="/predictor"
            className="hover:text-cyan-300 transition"
          >
            Predictor
          </Link>

          {/* Profile */}

          <div
            className="relative"
            ref={dropdownRef}
         >

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 hover:bg-blue-800 px-3 py-2 rounded-lg transition"
            >

              {student?.profilePhoto ? (
                <img
                  src={student.profilePhoto}
                  alt="Profile"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <FaUserCircle className="text-4xl" />
              )}

              <div className="hidden md:block text-left">

                <p className="text-xs">
                  Hello,
                </p>

                <p className="font-semibold">
                  {student?.name || "Student"}
                </p>

              </div>

              <FaChevronDown
                className={`transition duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />

            </button>

            {open && (
              <ProfileDropdown
                student={student}
                logout={logout}
                closeDropdown={() => setOpen(false)}
              />
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;