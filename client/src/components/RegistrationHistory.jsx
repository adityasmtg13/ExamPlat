import React from "react";

function RegistrationHistory({ registrations = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Registered":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Registered
          </span>
        );

      case "Pending Payment":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
            Pending Payment
          </span>
        );

      case "Cancelled":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
            Cancelled
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Registration History
      </h2>

      {registrations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
          No registrations found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-4 text-left">Registration No</th>
                <th className="p-4 text-left">Exam</th>
                <th className="p-4 text-center">Fee</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((registration) => (
                <tr
                  key={registration._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {registration.registrationNumber}
                  </td>

                  <td className="p-4">
                    {registration.examType}
                  </td>

                  <td className="p-4 text-center font-semibold">
                    ₹{registration.registrationFee}
                  </td>

                  <td className="p-4 text-center">
                    {getStatusBadge(registration.status)}
                  </td>

                  <td className="p-4 text-center">
                    {registration.status === "Pending Payment" && (
                      <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Proceed to Payment
                      </button>
                    )}

                    {registration.status === "Registered" && (
                      <button
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        Download Receipt
                      </button>
                    )}

                    {registration.status === "Cancelled" && (
                      <button
                        disabled
                        className="cursor-not-allowed rounded-lg bg-gray-400 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Cancelled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RegistrationHistory;