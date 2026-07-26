import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createPayment } from "../services/paymentService";
import { getRegistrationById } from "../services/registrationService";

const Payment = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams();

  const [registration, setRegistration] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await getRegistrationById(registrationId);
        setRegistration(response.registration);
      } catch (error) {
        alert(error.message || "Unable to load registration.");
        navigate("/register-exam");
      } finally {
        setPageLoading(false);
      }
    };

    if (registrationId) {
      fetchRegistration();
    } else {
      navigate("/register-exam");
    }
  }, [registrationId, navigate]);

  const handleContinue = async () => {
    try {
      setLoading(true);

      const response = await createPayment({
        registrationId,
        paymentMethod,
      });

      const payment = response.payment;

      switch (paymentMethod) {
        case "UPI":
          navigate("/payment/upi", {
            state: { payment },
          });
          break;

        case "QR":
          navigate("/payment/qr", {
            state: { payment },
          });
          break;

        case "Card":
          navigate("/payment/card", {
            state: { payment },
          });
          break;

        default:
          break;
      }
    } catch (error) {
      alert(error.message || "Unable to create payment.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!registration) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">
          ExamPlat Payment
        </h1>

        <div className="mb-6 space-y-4 rounded-lg border p-5">
          <div className="flex justify-between">
            <span className="font-medium">Registration Number</span>
            <span>{registration.registrationNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Exam</span>
            <span>{registration.examType}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Amount</span>
            <span className="font-bold text-green-600">
              ₹{registration.registrationFee}
            </span>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold">
          Select Payment Method
        </h2>

        <div className="mb-8 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>UPI</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <input
              type="radio"
              value="QR"
              checked={paymentMethod === "QR"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>QR Code</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <input
              type="radio"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Debit / Credit Card</span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className={`w-full rounded-lg py-3 font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Payment..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Payment;