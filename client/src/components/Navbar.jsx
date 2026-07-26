import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

import ProfileDropdown from "./ProfileDropdown";
import { getStudent } from "../storage";

function Navbar() {
  const navigate = useNavigate();

  const student = getStudent();

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
    <nav className="bg-white text-[#103f7c] shadow-md border-b">
      <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            className="w-14 h-auto object-contain"
            alt="Emblem of India"
          />
          <h1 className="font-bold text-[#103f7c] text-2xl md:text-3xl">
            National Exam Platform
          </h1>
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <Link
            to="/dashboard"
            className="font-semibold text-[#103f7c] hover:text-orange-500 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/mock-tests"
            className="font-semibold text-[#103f7c] hover:text-orange-500 transition"
          >
            Mock Tests
          </Link>

          <Link
            to="/analytics"
            className="font-semibold text-[#103f7c] hover:text-orange-500 transition"
          >
            Analytics
          </Link>

          <Link
            to="/predictor"
            className="font-semibold text-[#103f7c] hover:text-orange-500 transition"
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