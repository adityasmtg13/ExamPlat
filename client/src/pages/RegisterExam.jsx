import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function RegisterExam() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#103f7c]">
            Register for Examination
          </h1>
          <p className="text-lg text-gray-700 mt-6">
            Proceeding to Payment Details
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#103f7c] px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-[#0b2d57]"
            onClick={() => navigate(-1)}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterExam;
