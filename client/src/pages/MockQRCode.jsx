import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completePayment } from "../services/paymentService";

const MockQRCode = () => {
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

      // Simulate QR scan and payment delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await completePayment(payment._id);

      navigate("/payment/success", {
        state: {
          payment: response.payment,
        },
      });
    } catch (error) {
      alert(error.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          QR Code Payment
        </h1>

        <div className="mb-6 flex justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=examplat@ybl&pn=ExamPlat&am=${payment.amount}`}
            alt="QR Code"
            className="rounded-lg border shadow"
          />
        </div>

        <div className="mb-8 space-y-3 rounded-xl border p-5">
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

        <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-center text-sm text-gray-700">
          <p>
            In a real payment gateway, you would scan this QR code using your
            preferred UPI application.
          </p>
          <p className="mt-2 font-semibold">
            Click the button below for successful QR payment.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full rounded-lg py-3 text-lg font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying Payment..." : `I've Paid ₹${payment.amount}`}
        </button>
      </div>
    </div>
  );
};

export default MockQRCode;