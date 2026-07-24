import Navbar from "../components/Navbar";
import {
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaUniversity,
} from "react-icons/fa";

function Dashboard() {
  const student = JSON.parse(localStorage.getItem("student"));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">
          Welcome,
          <span className="text-blue-700">
            {" "}
            {student?.name}
          </span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Student Profile */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">
              Student Profile
            </h3>

            <div className="space-y-4">
              <p>
                <b>Name :</b> {student?.name}
              </p>

              <p>
                <b>Email :</b> {student?.email}
              </p>

              <p>
                <b>Phone :</b> {student?.phone || "--"}
              </p>

              <p>
                <b>Stream :</b> {student?.stream || "--"}
              </p>

              <p>
                <b>Class :</b> {student?.studentClass || "--"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">
              Quick Stats
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-cyan-100 p-5 rounded-xl">
                <h4 className="font-bold">Mock Tests</h4>
                <p className="text-3xl mt-2">0</p>
              </div>

              <div className="bg-green-100 p-5 rounded-xl">
                <h4 className="font-bold">Accuracy</h4>
                <p className="text-3xl mt-2">--</p>
              </div>

              <div className="bg-pink-100 p-5 rounded-xl">
                <h4 className="font-bold">Predicted AIR</h4>
                <p className="text-3xl mt-2">--</p>
              </div>

              <div className="bg-yellow-100 p-5 rounded-xl">
                <h4 className="font-bold">Percentile</h4>
                <p className="text-3xl mt-2">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <h2 className="text-3xl font-bold mt-12 mb-8">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition cursor-pointer">
            <FaClipboardList className="text-gray-600 text-5xl mb-4" />
            <h3 className="font-bold text-xl">Mock Tests</h3>
            <p className="text-gray-600 mt-2">
              Practice AI-generated exams.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition cursor-pointer">
            <FaChartBar className="text-green-600 text-5xl mb-4" />
            <h3 className="font-bold text-xl">Analytics</h3>
            <p className="text-gray-600 mt-2">
              View detailed performance reports.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition cursor-pointer">
            <FaUserGraduate className="text-pink-600 text-5xl mb-4" />
            <h3 className="font-bold text-xl">Rank Predictor</h3>
            <p className="text-gray-600 mt-2">
              Predict your JEE/NEET rank.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition cursor-pointer">
            <FaUniversity className="text-yellow-600 text-5xl mb-4" />
            <h3 className="font-bold text-xl">
              College Predictor
            </h3>
            <p className="text-gray-600 mt-2">
              Explore colleges based on your rank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;