import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

import ProfileDropdown from "./ProfileDropdown";
import { getStudent } from "../storage";
import { logoutStudent } from "../services/authService";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  const student = getStudent();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await logoutStudent();
    } catch (error) {
      console.error("Logout API Error:", error);
    }

    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Mock Tests", to: "/mock-tests" },
    { label: "Marks", to: "/marks" },
    { label: "Analytics", to: "/analytics" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            className="h-12 w-12 rounded-lg border border-slate-200 bg-white p-1.5 object-contain shadow-sm"
            alt="ExamPlatLogo"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              ExamPlat
            </p>
            <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">
              e-Examination Platform
            </h1>
          </div>
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:gap-6">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-100 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-cyan-700 hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-cyan-500 hover:shadow-md md:w-auto"
              aria-expanded={open}
            >
              <div className="flex items-center gap-3">
                {student?.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt="Profile"
                    className="h-11 w-11 rounded-full border-2 border-slate-100 object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-slate-500" />
                )}

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    Student
                  </p>
                  <p className="max-w-[160px] truncate font-semibold text-slate-900">
                    {student?.name || "Student"}
                  </p>
                </div>
              </div>

              <FaChevronDown
                className={`shrink-0 text-slate-500 transition duration-300 ${
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
