import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  FaUniversity,
  FaClipboardList,
  FaNewspaper,
  FaGraduationCap,
} from "react-icons/fa";

function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const examsRef = useRef(null);
  const noticeRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-gray-100">

      {/* ===================== TOP STRIP ===================== */}

      <div className="bg-[#0d2d62] text-white text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">

          <p>
            {new Date().toLocaleString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="flex gap-6">
            <button className="hover:text-yellow-300">
              Skip to Main Content
            </button>

            <button className="hover:text-yellow-300">
              English
            </button>
          </div>

        </div>
      </div>

      {/* ===================== NAVBAR ===================== */}

      <nav className="bg-white shadow-md">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div className="flex items-center gap-5">

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              className="w-14"
              alt=""
            />

            <div>

              <h1 className="text-4xl font-bold text-[#103f7c]">
                National Exam Platform
              </h1>

            </div>

          </div>

          <div className="flex gap-10 font-semibold text-[#103f7c]">

            <button
              onClick={() => scrollToSection(heroRef)}
              className="hover:text-orange-500 transition"
            >
              HOME
            </button>

            <button
              onClick={() => scrollToSection(aboutRef)}
              className="hover:text-orange-500 transition"
            >
              ABOUT
            </button>

            <button
              onClick={() => scrollToSection(examsRef)}
              className="hover:text-orange-500 transition"
            >
              EXAMS
            </button>

            <button
              onClick={() => scrollToSection(noticeRef)}
              className="hover:text-orange-500 transition"
            >
              NOTICE
            </button>

            <button
              onClick={() => scrollToSection(contactRef)}
              className="hover:text-orange-500 transition"
            >
              CONTACT
            </button>

          </div>

        </div>

      </nav>

      {/* ===================== HERO ===================== */}

      <div
        ref={heroRef}
        className="h-[550px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600')",
        }}
      >

        <div className="h-full bg-blue-950/75 flex items-center">

          <div className="max-w-7xl mx-auto px-6">

            <h1 className="text-6xl font-bold text-white mb-5">

              National Exam Platform

            </h1>

            <p className="text-2xl text-gray-200 mb-8 max-w-2xl">

              India's Official AI Powered Examination Platform
              for National Level Competitive Examinations.

            </p>

            <div className="flex gap-5">

              <Link to="/login">

                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold">

                  Login

                </button>

              </Link>

              <Link to="/register">

                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold">

                  Register

                </button>

              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ===================== LATEST NEWS ===================== */}

      <div ref={noticeRef} className="bg-white shadow">

        <div className="max-w-7xl mx-auto flex">

          <div className="bg-[#0d2d62] text-white px-6 py-4 font-bold">

            Latest Updates

          </div>

          <marquee className="py-4 text-green-600 font-semibold">

            🟢 JEE Main 2027 Registration opens on 15 September 2026 • 🟢 NEET UG Mock Tests are now available • 🟢 AI Rank Predictor launched • 🟢 Student Dashboard Version 2.0 released • 🟢 National Exam Platform welcomes all aspirants.

          </marquee>

        </div>

      </div>

      {/* ===================== FEATURES ===================== */}

      <div className="max-w-7xl mx-auto py-16 px-6">

        <h2 className="text-4xl font-bold text-center mb-14">

          National Services

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">

            <FaClipboardList className="text-5xl text-blue-700 mb-5"/>

            <h3 className="font-bold text-xl mb-3">

              Mock Tests

            </h3>

            <p>

              Unlimited AI Generated Practice Tests.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">

            <FaNewspaper className="text-5xl text-green-700 mb-5"/>

            <h3 className="font-bold text-xl mb-3">

              Notifications

            </h3>

            <p>

              Latest Exam Announcements.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">

            <FaGraduationCap className="text-5xl text-pink-600 mb-5"/>

            <h3 className="font-bold text-xl mb-3">

              Rank Predictor

            </h3>

            <p>

              Predict AIR using AI.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">

            <FaUniversity className="text-5xl text-yellow-600 mb-5"/>

            <h3 className="font-bold text-xl mb-3">

              College Predictor

            </h3>

            <p>

              Find Best Colleges.

            </p>

          </div>

        </div>

      </div>

    {/* ===================== ABOUT ===================== */}

    <div ref={aboutRef} className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

        <div>
          <h2 className="text-4xl font-bold text-[#103f7c] mb-6">
            About National Exam Platform
          </h2>

          <p className="text-gray-700 leading-8 text-lg">
            National Exam Platform (NEP) is an AI-powered digital examination
            portal developed to provide a centralized ecosystem for national
            competitive examinations such as JEE, NEET and future government
            entrance examinations.
          </p>

          <p className="text-gray-700 leading-8 mt-5">
            The platform provides mock examinations, AI based analytics,
            rank prediction, college prediction, personalized recommendations
            and real-time performance tracking for every student.
          </p>

          <a
            href="https://www.nta.ac.in/Home"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-8 bg-[#103f7c] text-white px-7 py-3 rounded-lg hover:bg-[#0d2d62] transition">
              Read More
            </button>
          </a>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200"
            className="rounded-xl shadow-xl"
            alt=""
          />
        </div>

      </div>
    </div>

    {/* ===================== UPCOMING EXAMS ===================== */}

    <div ref={examsRef} className="py-20 bg-gray-100">

    <h2 className="text-center text-4xl font-bold mb-12">
    Upcoming Examinations
    </h2>

    <div className="max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg">

    <table className="w-full bg-white">

    <thead className="bg-[#103f7c] text-white">

    <tr>

    <th className="py-4">Examination</th>

    <th>Date</th>

    <th>Status</th>

    </tr>

    </thead>

    <tbody>

    <tr className="text-center border-b hover:bg-gray-50">

    <td className="py-5">JEE Main 2027</td>

    <td>15 January 2027</td>

    <td className="text-green-600 font-semibold">
    Registration Open
    </td>

    </tr>

    <tr className="text-center border-b hover:bg-gray-50">

    <td className="py-5">NEET UG 2027</td>

    <td>05 May 2027</td>

    <td className="text-orange-600 font-semibold">
    Coming Soon
    </td>

    </tr>

    <tr className="text-center hover:bg-gray-50">

    <td className="py-5">CUET UG</td>

    <td>April 2027</td>

    <td className="text-blue-700 font-semibold">
    Upcoming
    </td>

    </tr>

    </tbody>

    </table>

    </div>

    </div>

    {/* ===================== QUICK LINKS ===================== */}

    <div className="py-20 bg-white">

    <h2 className="text-center text-4xl font-bold mb-12">
    Quick Links
    </h2>

    <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">

    <Link to="/register" className="bg-gray-100 p-8 rounded-xl hover:bg-blue-50 transition shadow">
    <h3 className="font-bold text-xl mb-2">Student Registration</h3>
    <p>Create a new student account.</p>
    </Link>

    <Link to="/login" className="bg-gray-100 p-8 rounded-xl hover:bg-blue-50 transition shadow">
    <h3 className="font-bold text-xl mb-2">Student Login</h3>
    <p>Access your dashboard.</p>
    </Link>

    <a
      href="https://ntaresults.nic.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-100 p-8 rounded-xl shadow hover:bg-blue-50 transition block"
    >
      <h3 className="font-bold text-xl mb-2">Results</h3>
      <p>Official Results</p>
    </a>

    <a
      href="https://www.nta.ac.in/Downloads"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-100 p-8 rounded-xl shadow hover:bg-blue-50 transition block"
    >
      <h3 className="font-bold text-xl mb-2">Downloads</h3>
      <p>Syllabus & Notifications</p>
    </a>

    </div>

    </div>

    <footer
      ref={contactRef}
      className="bg-[#082b5a] text-white"
    >
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

    <div>

    <h2 className="text-2xl font-bold mb-5">
    National Exam Platform
    </h2>

    <p className="leading-8 text-gray-300">
    An initiative to provide AI-powered examination services,
    performance analytics, mock tests, and digital learning resources
    for students across India.
    </p>

    </div>

    <div>

    <h3 className="text-xl font-bold mb-5">
    Quick Links
    </h3>

    <ul className="space-y-3 text-gray-300">

    <li>
    <Link to="/">Home</Link>
    </li>

    <li>
    <Link to="/login">Student Login</Link>
    </li>

    <li>
    <Link to="/register">Student Registration</Link>
    </li>

    <li>
    <Link to="/mock-tests">Mock Tests</Link>
    </li>

    <li>
    <Link to="/notifications">Notifications</Link>
    </li>

    </ul>

    </div>

    <div>

    <h3 className="text-xl font-bold mb-5">
    Contact
    </h3>

    <p className="text-gray-300">
    National Exam Platform
    </p>

    <p className="text-gray-300">
    New Delhi - 110001
    </p>

    <p className="text-gray-300 mt-3">
    📧 support@nexam.gov.in
    </p>

    <p className="text-gray-300">
    ☎ 1800-000-0000
    </p>

    </div>

    </div>

    <div className="border-t border-blue-700 py-5 text-center text-gray-300">

    © 2026 National Exam Platform

    </div>

    </footer>

  </div>

  );
}

export default Home;