import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MockTestList from "../components/MockTestList";
import { getMockTests } from "../services/mockTestService";

function MockTestsJEE() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMockTests = async () => {
    try {
      const data = await getMockTests();
      const jeeTests = (data.mockTests || []).filter(
        (test) => test.examCategory === "JEE"
      );
      setTests(jeeTests);
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
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
        >
          <FaArrowLeft className="text-xs" />
          Back to Exam Selection
        </button>

        <MockTestList examCategory="JEE" tests={tests} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}

export default MockTestsJEE;
