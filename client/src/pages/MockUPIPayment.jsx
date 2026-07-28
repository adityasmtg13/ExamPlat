import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { completePayment } from "../services/paymentService";

const MockUPIPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const payment = location.state?.payment;

  const [loading, setLoading] = useState(false);

  if (!payment) {
    navigate("/register-exam");
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const response = await completePayment(payment._id);

      navigate("/payment/success", {
        state: {
          payment: response.payment,
        },
      });
    } catch (error) {
      toast.error(error.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          ExamPlat UPI Payment
        </h1>

        <div className="space-y-4 border rounded-xl p-5 mb-8">
          <div className="flex justify-between">
            <span className="font-medium">Merchant</span>
            <span>ExamPlat</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">UPI ID</span>
            <span>examplat@ybl</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Payment Number</span>
            <span>{payment.paymentNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Amount</span>
            <span className="font-bold text-green-600">
              ₹{payment.amount}
            </span>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-gray-700">
            Pay using UPI.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full rounded-lg py-3 text-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing Payment..." : `Pay ₹${payment.amount}`}
        </button>
      </div>
    </div>
  );
};

export default MockUPIPayment;