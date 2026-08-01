import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  FaUniversity,
  FaClipboardList,
  FaNewspaper,
  FaGraduationCap,
  FaUserGraduate,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaBookOpen,
  FaFlask,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import logo from "../assets/logo.png";

function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const examsRef = useRef(null);
  const noticeRef = useRef(null);
  const contactRef = useRef(null);
  const mockTestRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [currentJeeIndex, setCurrentJeeIndex] = useState(0);
  const [currentNeetIndex, setCurrentNeetIndex] = useState(0);
  const [jeeAnswers, setJeeAnswers] = useState({});
  const [neetAnswers, setNeetAnswers] = useState({});
  const [jeeSubmitted, setJeeSubmitted] = useState(false);
  const [neetSubmitted, setNeetSubmitted] = useState(false);

  const jeeQuestions = [
    {
      id: 1,
      question: "What is the value of sin(90°)?",
      options: ["0", "1", "-1", "0.5"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the value of π (pi) approximately?",
      options: ["3.14", "3.41", "2.71", "1.62"],
      correct: 0,
    },
  ];

  const neetQuestions = [
    {
      id: 1,
      question: "Which of the following is the largest organ in the human body?",
      options: ["Liver", "Skin", "Heart", "Brain"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the chemical formula of water?",
      options: ["H2O", "CO2", "NaCl", "HCl"],
      correct: 0,
    },
    {
      id: 3,
      question: "Which vitamin is produced by the human body when exposed to sunlight?",
      options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
      correct: 3,
    },
  ];

  const examImages = [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
  ];

  const handleJeeAnswer = (optionIndex) => {
    if (!jeeSubmitted) {
      setJeeAnswers({
        ...jeeAnswers,
        [currentJeeIndex]: optionIndex,
      });
    }
  };

  const handleNeetAnswer = (optionIndex) => {
    if (!neetSubmitted) {
      setNeetAnswers({
        ...neetAnswers,
        [currentNeetIndex]: optionIndex,
      });
    }
  };

  const submitJee = () => {
    setJeeSubmitted(true);
  };

  const submitNeet = () => {
    setNeetSubmitted(true);
  };

  const resetJee = () => {
    setJeeAnswers({});
    setJeeSubmitted(false);
    setCurrentJeeIndex(0);
  };

  const resetNeet = () => {
    setNeetAnswers({});
    setNeetSubmitted(false);
    setCurrentNeetIndex(0);
  };

  const getJeeScore = () => {
    let correct = 0;
    jeeQuestions.forEach((q, index) => {
      if (jeeAnswers[index] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getNeetScore = () => {
    let correct = 0;
    neetQuestions.forEach((q, index) => {
      if (neetAnswers[index] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-gray-50">

      {/* ===================== TOP STRIP ===================== */}
      <div className="bg-[#0d2d62] text-white text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
          <div className="flex items-center gap-6">
            <p>
              {new Date().toLocaleString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 bg-blue-800 px-3 py-1 rounded-full">
              <span className="text-yellow-400">🕐</span>
              <span className="font-mono font-bold">{formatTime(currentTime)}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-orange-500 transition">SKIP TO MAIN CONTENT</button>
            <button className="hover:text-yellow-300 transition">English</button>
          </div>
        </div>
      </div>

      {/* ===================== NAVBAR ===================== */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ExamPlat logo"
              className="h-12 w-12 rounded-lg bg-white p-1.5"
            />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                ExamPlat
              </p>
              <h2 className="text-2xl font-bold">e-Examination Platform</h2>
            </div>
          </div>
          <div className="flex gap-8 font-semibold text-[#0d2d62]">
            <button onClick={() => scrollToSection(heroRef)} className="hover:text-orange-500 transition">HOME</button>
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-orange-500 transition">ABOUT</button>
            <button onClick={() => scrollToSection(examsRef)} className="hover:text-orange-500 transition">EXAMS</button>
            <button onClick={() => scrollToSection(mockTestRef)} className="hover:text-orange-500 transition">TEST PREVIEW</button>
            <button onClick={() => scrollToSection(noticeRef)} className="hover:text-orange-500 transition">NOTICE</button>
            <button onClick={() => scrollToSection(contactRef)} className="hover:text-orange-500 transition">CONTACT</button>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <div
        ref={heroRef}
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d62]/90 to-[#0d2d62]/70 flex items-center">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-400 text-[#0d2d62] px-4 py-2 rounded-full font-bold text-sm">
                  India's AI Powered Examination Platform
                </div>
              </div>
              <h1 className="text-6xl font-bold text-white mb-5 leading-tight">
                EXAMPLAT <br />e-Examination Platform
              </h1>
              <p className="text-2xl text-gray-200 mb-8">
                India's Premier Digital Examination Platform for JEE, NEET &amp; National Level Competitive Exams
              </p>
              <div className="flex gap-5">
                <Link to="/login">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-semibold shadow-lg transition">
                    Student Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg font-semibold shadow-lg transition">
                    New Registration
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== EXAM IMAGES CAROUSEL ===================== */}
      <div className="bg-white py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 animate-scroll">
            {examImages.map((img, index) => (
              <div key={index} className="min-w-[300px] relative group">
                <img
                  src={img}
                  alt={`Exam ${index + 1}`}
                  className="h-56 w-full object-cover rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d62]/70 to-transparent rounded-xl flex items-end p-4">
                  <p className="text-white font-bold text-lg">
                    {index === 0 && "📝 JEE Main Examination"}
                    {index === 1 && "🔬 NEET UG Examination"}
                    {index === 2 && "💻 Computer Based Test"}
                    {index === 3 && "📚 AI Analytics & Rank Prediction"}
                  </p>
                </div>
              </div>
            ))}
            {examImages.map((img, index) => (
              <div key={`dup-${index}`} className="min-w-[300px] relative group">
                <img
                  src={img}
                  alt={`Exam ${index + 1}`}
                  className="h-56 w-full object-cover rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d62]/70 to-transparent rounded-xl flex items-end p-4">
                  <p className="text-white font-bold text-lg">
                    {index === 0 && "📝 JEE Main Examination"}
                    {index === 1 && "🔬 NEET UG Examination"}
                    {index === 2 && "💻 Computer Based Test"}
                    {index === 3 && "📚 AI Analytics & Rank Prediction"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== LATEST NEWS ===================== */}
      <div ref={noticeRef} className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto flex">
          <div className="bg-[#0d2d62] text-white px-6 py-4 font-bold flex items-center gap-2">
            <FaNewspaper /> Latest Updates
          </div>
          <marquee className="py-4 text-green-600 font-semibold">
            🟢 JEE Main 2027 Registration opens on 15 September 2026 • 🟢 NEET UG Mock Tests are now available • 🟢 AI Rank Predictor launched • 🟢 Student Dashboard Version 2.0 released • 🟢 National Exam Platform welcomes all aspirants.
          </marquee>
        </div>
      </div>

      {/* ===================== FEATURES ===================== */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-14 text-[#0d2d62]">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-[#0d2d62]">
            <FaClipboardList className="text-5xl text-[#0d2d62] mb-5"/>
            <h3 className="font-bold text-xl mb-3">Mock Tests</h3>
            <p>Comprehensive practice tests for all competitive exams.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-green-600">
            <FaNewspaper className="text-5xl text-green-600 mb-5"/>
            <h3 className="font-bold text-xl mb-3">Notifications</h3>
            <p>Latest Exam Announcements and Updates.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-pink-600">
            <FaChartLine className="text-5xl text-pink-600 mb-5"/>
            <h3 className="font-bold text-xl mb-3">Rank Predictor</h3>
            <p>Predict your rank using AI-powered analytics.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border-t-4 border-yellow-600">
            <FaUniversity className="text-5xl text-yellow-600 mb-5"/>
            <h3 className="font-bold text-xl mb-3">College Predictor</h3>
            <p>Find best colleges based on your predicted rank.</p>
          </div>
        </div>
      </div>

      {/* ===================== MOCK TEST SANDBOX ===================== */}
      <div ref={mockTestRef} className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0d2d62] mb-4">Preview Test Sandbox</h2>
            <p className="text-gray-600 text-lg">Practice with sample questions from JEE and NEET examinations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* JEE Section */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#0d2d62] to-[#1a4a8a] text-white p-4 flex items-center gap-3">
                <FaBookOpen className="text-2xl" />
                <h3 className="text-xl font-bold">JEE Main Practice</h3>
                <span className="ml-auto bg-yellow-400 text-[#0d2d62] px-3 py-1 rounded-full text-sm font-bold">
                  Q {currentJeeIndex + 1}/{jeeQuestions.length}
                </span>
              </div>
              
              <div className="p-6">
                {!jeeSubmitted ? (
                  <>
                    <div className="mb-6">
                      <p className="text-lg font-medium text-gray-800">
                        {jeeQuestions[currentJeeIndex].question}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {jeeQuestions[currentJeeIndex].options.map((option, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleJeeAnswer(idx)}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                            jeeAnswers[currentJeeIndex] === idx
                              ? "border-[#0d2d62] bg-blue-50"
                              : "border-gray-200 hover:border-[#0d2d62]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setCurrentJeeIndex(Math.max(0, currentJeeIndex - 1))}
                        disabled={currentJeeIndex === 0}
                        className="px-4 py-2 border-2 border-[#0d2d62] text-[#0d2d62] rounded-lg hover:bg-[#0d2d62] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={() => setCurrentJeeIndex(Math.min(jeeQuestions.length - 1, currentJeeIndex + 1))}
                        disabled={currentJeeIndex === jeeQuestions.length - 1}
                        className="px-4 py-2 border-2 border-[#0d2d62] text-[#0d2d62] rounded-lg hover:bg-[#0d2d62] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowRight />
                      </button>
                      <button
                        onClick={submitJee}
                        disabled={Object.keys(jeeAnswers).length < jeeQuestions.length}
                        className="ml-auto bg-[#0d2d62] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a8a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Test
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-[#0d2d62] mb-2">
                        Score: {getJeeScore()} / {jeeQuestions.length}
                      </div>
                      <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Correct: {getJeeScore()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaTimesCircle className="text-red-500" />
                          <span>Incorrect: {jeeQuestions.length - getJeeScore()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={resetJee}
                      className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
                    >
                      Retry Test
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* NEET Section */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center gap-3">
                <FaFlask className="text-2xl" />
                <h3 className="text-xl font-bold">NEET UG Practice</h3>
                <span className="ml-auto bg-yellow-400 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Q {currentNeetIndex + 1}/{neetQuestions.length}
                </span>
              </div>
              
              <div className="p-6">
                {!neetSubmitted ? (
                  <>
                    <div className="mb-6">
                      <p className="text-lg font-medium text-gray-800">
                        {neetQuestions[currentNeetIndex].question}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {neetQuestions[currentNeetIndex].options.map((option, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNeetAnswer(idx)}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                            neetAnswers[currentNeetIndex] === idx
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-green-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setCurrentNeetIndex(Math.max(0, currentNeetIndex - 1))}
                        disabled={currentNeetIndex === 0}
                        className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={() => setCurrentNeetIndex(Math.min(neetQuestions.length - 1, currentNeetIndex + 1))}
                        disabled={currentNeetIndex === neetQuestions.length - 1}
                        className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowRight />
                      </button>
                      <button
                        onClick={submitNeet}
                        disabled={Object.keys(neetAnswers).length < neetQuestions.length}
                        className="ml-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Test
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Score: {getNeetScore()} / {neetQuestions.length}
                      </div>
                      <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Correct: {getNeetScore()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaTimesCircle className="text-red-500" />
                          <span>Incorrect: {neetQuestions.length - getNeetScore()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={resetNeet}
                      className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
                    >
                      Retry Test
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== ABOUT ===================== */}
      <div ref={aboutRef} className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#0d2d62] w-12 h-1"></div>
              <span className="text-[#0d2d62] font-semibold">About Us</span>
            </div>
            <h2 className="text-4xl font-bold text-[#0d2d62] mb-6">
              About EXAMPLAT
            </h2>
            <p className="text-gray-700 leading-8 text-lg">
              EXAMPLAT is a premier AI-powered e-Examination
              portal designed to provide a centralized ecosystem for national
              competitive examinations including JEE, NEET, and other entrance tests.
            </p>
            <p className="text-gray-700 leading-8 mt-5">
              The platform offers mock examinations, AI-based analytics,
              rank prediction, college prediction, personalized recommendations,
              and real-time performance tracking for every student.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-[#0d2d62] text-white px-8 py-3 rounded-lg hover:bg-[#1a4a8a] transition shadow-lg">
                  Learn More
                </button>
              </a>
              <Link to="/login">
                <button className="border-2 border-[#0d2d62] text-[#0d2d62] px-8 py-3 rounded-lg hover:bg-[#0d2d62] hover:text-white transition">
                  <FaUserGraduate className="inline mr-2" /> Student Portal
                </button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200"
              className="rounded-xl shadow-2xl"
              alt="Students studying"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#0d2d62] text-white p-4 rounded-xl shadow-lg">
              <MdEmojiEvents className="text-4xl inline-block" />
              <p className="font-bold">Setting the global gold standard in examination integrity,<br/> precision logistics, and flawless execution</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== UPCOMING EXAMS ===================== */}
      <div ref={examsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12 text-[#0d2d62]">
            Upcoming Examinations
          </h2>
          <div className="overflow-hidden rounded-xl shadow-2xl border-2 border-[#0d2d62]">
            <table className="w-full bg-white">
              <thead className="bg-[#0d2d62] text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Examination</th>
                  <th className="py-4 px-6 text-left">Date</th>
                  <th className="py-4 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-5 px-6 font-semibold">JEE Main 2027</td>
                  <td className="py-5 px-6">15 January 2027</td>
                  <td className="py-5 px-6 text-green-600 font-semibold">
                    <span className="bg-green-100 px-3 py-1 rounded-full">Registration Open</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-5 px-6 font-semibold">NEET UG 2027</td>
                  <td className="py-5 px-6">05 May 2027</td>
                  <td className="py-5 px-6 text-orange-600 font-semibold">
                    <span className="bg-orange-100 px-3 py-1 rounded-full">Coming Soon</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-5 px-6 font-semibold">CUET UG 2027</td>
                  <td className="py-5 px-6">April 2027</td>
                  <td className="py-5 px-6 text-blue-600 font-semibold">
                    <span className="bg-blue-100 px-3 py-1 rounded-full">Upcoming</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== QUICK LINKS ===================== */}
      <div className="py-20 bg-white">
        <h2 className="text-center text-4xl font-bold mb-12 text-[#0d2d62]">
          Quick Links
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          <Link to="/register" className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl hover:shadow-2xl transition shadow-lg border-t-4 border-[#0d2d62]">
            <FaUserGraduate className="text-4xl text-[#0d2d62] mb-3" />
            <h3 className="font-bold text-xl mb-2">Student Registration</h3>
            <p className="text-gray-600">Create a new student account</p>
          </Link>
          <Link to="/login" className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl hover:shadow-2xl transition shadow-lg border-t-4 border-green-600">
            <FaGraduationCap className="text-4xl text-green-600 mb-3" />
            <h3 className="font-bold text-xl mb-2">Student Login</h3>
            <p className="text-gray-600">Access your dashboard</p>
          </Link>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl hover:shadow-2xl transition shadow-lg border-t-4 border-yellow-600 block"
          >
            <FaChartLine className="text-4xl text-yellow-600 mb-3" />
            <h3 className="font-bold text-xl mb-2">Results</h3>
            <p className="text-gray-600">Check your results</p>
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl hover:shadow-2xl transition shadow-lg border-t-4 border-purple-600 block"
          >
            <FaClipboardList className="text-4xl text-purple-600 mb-3" />
            <h3 className="font-bold text-xl mb-2">Downloads</h3>
            <p className="text-gray-600">Syllabus &amp; Notifications</p>
          </a>
        </div>
      </div>

      {/* ===================== FOOTER ===================== */}
      <footer ref={contactRef} className="bg-[#0d2d62] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                            src={logo}
                            alt="ExamPlat logo"
                            className="h-12 w-12 rounded-lg bg-white p-1.5"
              />
              <h2 className="text-2xl font-bold">EXAMPLAT</h2>
            </div>
            <p className="leading-8 text-gray-300">
              India's premier e-Examination platform providing
              AI-powered practice tests, performance analytics,
              and personalized resources for students
              preparing for national competitive exams.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
              <li><Link to="/login" className="hover:text-yellow-300 transition">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-yellow-300 transition">Student Registration</Link></li>
              <li><Link to="/mock-tests" className="hover:text-yellow-300 transition">Mock Tests</Link></li>
              <li><Link to="/notifications" className="hover:text-yellow-300 transition">Notifications</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-5">Contact Information</h3>
            <p className="text-gray-300">EXAMPLAT</p>
            <p className="text-gray-300">Amaravati - 522237</p>
            <p className="text-gray-300 mt-3" href="mailto:support@examplat.in">📧 support@examplat.in</p>
            <p className="text-gray-300">☎ 1800-000-0000</p>
          </div>
        </div>
        <div className="border-t border-blue-700 py-5 text-center text-gray-300">
          <p>© 2026 EXAMPLAT • All Rights Reserved</p>
        </div>
      </footer>

      {/* ===================== CSS ANIMATIONS ===================== */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default Home;