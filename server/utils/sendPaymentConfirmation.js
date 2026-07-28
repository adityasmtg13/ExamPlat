const transporter = require("./mailSender");
const generatePaymentEmail = require("./paymentEmail");
const {
  generateReceiptBuffer,
} = require("./receiptGenerator");

/**
 * Send payment confirmation email with PDF receipt
 */
const sendPaymentConfirmation = async ({
  student,
  registration,
  payment,
}) => {
  try {
    // Receipt Number
    const receiptNumber = `RCPT${new Date().getFullYear()}${payment.paymentNumber.slice(
      -5
    )}`;

    // Generate email content
    const email = generatePaymentEmail(
      student,
      registration,
      payment,
      receiptNumber
    );

    // Generate PDF attachment
    const pdfBuffer = await generateReceiptBuffer({
      receiptNumber,
      student,
      registration,
      payment,
    });

    // Send email
    const recipientEmail = student?.email || student?.alternateEmail || process.env.BREVO_TO_EMAIL;
    const recipients = [recipientEmail, process.env.BREVO_TO_EMAIL].filter(Boolean);

    const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";

    await transporter.sendMail({
      from: `"ExamPlat" <${senderAddress}>`,
      to: recipients,
      subject: email.subject,
      html: email.html,

      attachments: [
        {
          filename: `${receiptNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(
      `✅ Payment confirmation email sent to ${recipients.join(", ")}`
    );
  } catch (err) {
    console.error(
      "❌ Failed to send payment confirmation email:",
      err
    );

    // Don't throw the error.
    // Payment should remain successful even if email fails.
  }
};

module.exports = sendPaymentConfirmation;