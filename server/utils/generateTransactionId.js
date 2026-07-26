const Payment = require("../models/Payment");

/**
 * Generates the next payment number.
 * Example: PAY202600001
 */
const generatePaymentNumber = async () => {
  const year = new Date().getFullYear();

  const latestPayment = await Payment.findOne()
    .sort({ createdAt: -1 })
    .select("paymentNumber");

  let nextNumber = 1;

  if (latestPayment && latestPayment.paymentNumber) {
    const lastNumber = parseInt(
      latestPayment.paymentNumber.slice(-5),
      10
    );

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `PAY${year}${String(nextNumber).padStart(5, "0")}`;
};

/**
 * Generates a unique transaction ID.
 * Example: TXN202607261530458742
 */
const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `TXN${timestamp}${random}`;
};

module.exports = {
  generatePaymentNumber,
  generateTransactionId,
};