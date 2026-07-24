import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-6">

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

        <div>

          <div className="flex items-center gap-3 mb-6">

            <FaGraduationCap
              className="text-yellow-400"
              size={45}
            />

            <h1 className="text-white text-4xl font-bold">
              AI Exam Prep Platform
            </h1>

          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-5">

            Crack
            <span className="text-cyan-400">
              {" "}JEE{" "}
            </span>

            &
            <span className="text-pink-400">
              {" "}NEET
            </span>

            <br />

            Smarter with AI

          </h2>

          <p className="text-gray-300 text-lg mb-8">

            Practice unlimited mock tests,
            analyze your performance,
            predict your AIR,
            and discover your dream college —
            all in one place.

          </p>

          <div className="flex gap-5">

            <Link to="/login">

              <button className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition">

                Login

              </button>

            </Link>

            <Link to="/register">

              <button className="px-8 py-4 rounded-xl border border-white text-white hover:bg-white hover:text-black transition">

                Register

              </button>

            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">

          <div className="flex items-center gap-4 mb-8">

            <MdOutlineQuiz
              className="text-cyan-400"
              size={40}
            />

            <div>

              <h2 className="text-white text-xl font-bold">

                Unlimited Mock Tests

              </h2>

              <p className="text-gray-300">

                JEE & NEET Pattern

              </p>

            </div>

          </div>

          <div className="flex items-center gap-4 mb-8">

            <AiOutlineLineChart
              className="text-green-400"
              size={40}
            />

            <div>

              <h2 className="text-white text-xl font-bold">

                AI Performance Analytics

              </h2>

              <p className="text-gray-300">

                Detailed subject analysis

              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <FaGraduationCap
              className="text-pink-400"
              size={40}
            />

            <div>

              <h2 className="text-white text-xl font-bold">

                Rank & College Predictor

              </h2>

              <p className="text-gray-300">

                Predict AIR and Colleges

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;