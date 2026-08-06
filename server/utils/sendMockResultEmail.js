const transporter = require("./mailSender");
const generateMockResultEmail = require("./mockResultEmail");
const { generateMockResultBuffer } = require("./mockResultPdf");

/**
 * Send mock test result email with PDF attachment
 */
const sendMockResultEmail = async ({ student, result }) => {
  try {
    // Generate email content
    const email = generateMockResultEmail(student, result);

    // Generate PDF attachment
    const pdfBuffer = await generateMockResultBuffer({ result, student });

    const filename = `Mock_Result_${result.testTitle || "Mock_Test"}_${String(
      result.attemptId
    ).slice(-6)}.pdf`
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    // Send email
    const studentEmail = student?.email || student?.alternateEmail;
    const recipientEmail = studentEmail || process.env.BREVO_CC_EMAIL;
    const recipients = [recipientEmail, process.env.BREVO_CC_EMAIL].filter(Boolean);

    const senderAddress = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER || "noreply@example.com";

    await transporter.sendMail({
      from: `"ExamPlat Results" <${senderAddress}>`,
      to: [recipientEmail],
      cc: studentEmail ? [process.env.BREVO_CC_EMAIL] : undefined,
      subject: email.subject,
      html: email.html,

      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Mock result email sent to ${recipients.join(", ")}`);
  } catch (err) {
    console.error("❌ Failed to send mock result email:", err);
    throw err;
  }
};

module.exports = sendMockResultEmail;