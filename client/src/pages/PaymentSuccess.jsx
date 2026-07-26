import { useLocation, useNavigate } from "react-router-dom";
import { downloadReceipt } from "../services/receiptService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const payment = location.state?.payment;

  if (!payment) {
    navigate("/register-exam");
    return null;
  }

  const handleDownloadReceipt = async () => {
    try {
      await downloadReceipt(payment._id);
    } catch (error) {
      alert(error.message || "Unable to download receipt.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">✅</div>

          <h1 className="text-3xl font-bold text-green-700">
            Payment Successful
          </h1>

          <p className="mt-2 text-gray-600">
            Your exam registration payment has been completed successfully.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border p-6">
          <div className="flex justify-between">
            <span className="font-medium">Payment Number</span>
            <span>{payment.paymentNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Transaction ID</span>
            <span className="break-all text-right">
              {payment.transactionId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Amount Paid</span>
            <span className="font-bold text-green-600">
              ₹{payment.amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Payment Method</span>
            <span>{payment.paymentMethod}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Status</span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {payment.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Paid On</span>

            <span>
              {payment.paidAt
                ? new Date(payment.paidAt).toLocaleString("en-IN")
                : "-"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/register-exam")}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Registration History
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="flex-1 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Download Receipt
          </button>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;