import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MockTestList from "../components/MockTestList";
import { getMockTests } from "../services/mockTestService";

function MockTestsNEET() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMockTests = async () => {
    try {
      const data = await getMockTests();
      const neetTests = (data.mockTests || []).filter(
        (test) => test.examCategory === "NEET"
      );
      setTests(neetTests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMockTests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/mock-tests")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-600 hover:text-emerald-700"
        >
          <FaArrowLeft className="text-xs" />
          Back to Exam Selection
        </button>

        <MockTestList examCategory="NEET" tests={tests} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}

export default MockTestsNEET;