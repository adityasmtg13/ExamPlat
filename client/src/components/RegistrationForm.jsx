import { useState } from "react";

function RegistrationForm({
  student,
  onRegister,
  loading,
}) {
  const [examType, setExamType] = useState("NEET");

  const registrationFee =
    examType === "NEET" ? 500 : 600;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(examType);
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Register for Final Examination
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Student Name
          </label>

          <input
            type="text"
            value={student?.name || ""}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={student?.email || ""}
            readOnly
            className="w-full rounded-lg border bg-gray-100 p-3"
          />
        </div>

        {/* Exam Selection */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            Select Examination
          </label>

          <div className="space-y-3">

            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:border-blue-500">
              <div>
                <p className="font-semibold">
                  NEET
                </p>

                <p className="text-sm text-gray-500">
                  Registration Fee
                </p>
              </div>

              <div className="flex items-center gap-4">

                <span className="font-bold text-green-600">
                  ₹500
                </span>

                <input
                  type="radio"
                  value="NEET"
                  checked={examType === "NEET"}
                  onChange={(e) =>
                    setExamType(e.target.value)
                  }
                />
              </div>
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:border-blue-500">
              <div>
                <p className="font-semibold">
                  JEE Main
                </p>

                <p className="text-sm text-gray-500">
                  Registration Fee
                </p>
              </div>

              <div className="flex items-center gap-4">

                <span className="font-bold text-green-600">
                  ₹600
                </span>

                <input
                  type="radio"
                  value="JEE Main"
                  checked={examType === "JEE Main"}
                  onChange={(e) =>
                    setExamType(e.target.value)
                  }
                />
              </div>
            </label>

          </div>
        </div>

        {/* Fee */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              Registration Fee
            </span>

            <span className="text-xl font-bold text-blue-700">
              ₹{registrationFee}
            </span>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;