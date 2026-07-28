import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { completePayment } from "../services/paymentService";

const MockCardPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const payment = location.state?.payment;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  if (!payment) {
    navigate("/register-exam");
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    if (
      !cardNumber.trim() ||
      !cardHolder.trim() ||
      !expiry.trim() ||
      !cvv.trim()
    ) {
      toast.error("Please fill in all card details.");
      return;
    }

    try {
      setLoading(true);

      // Simulate payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          Card Payment
        </h1>

        <div className="mb-6 rounded-xl border p-5">
          <div className="mb-3 flex justify-between">
            <span className="font-medium">Merchant</span>
            <span>ExamPlat</span>
          </div>

          <div className="mb-3 flex justify-between">
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

        <form onSubmit={handlePayment} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Card Number
            </label>

            <input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Card Holder Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Expiry
              </label>

              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CVV
              </label>

              <input
                type="password"
                maxLength={3}
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 text-lg font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Processing Payment..."
              : `Pay ₹${payment.amount}`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          This is a simulated payment gateway for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default MockCardPayment;