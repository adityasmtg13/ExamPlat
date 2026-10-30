/**
 * Mail self-test for ExamPlat.
 *
 * Sends a single test email through the same transporter the app uses and
 * reports exactly what Brevo's relay says. Run it from the server directory:
 *
 *   npm run test:mail            (or)   node scripts/testMail.js
 *
 * A successful run prints "ACCEPTED (250)". IMPORTANT: 250 means Brevo's
 * relay accepted the mail — it does NOT mean it was delivered. If the Brevo
 * account is still in Sandbox/Test mode (or the sender is unverified), the
 * relay accepts everything but delivers nothing. In that case check:
 *   - Brevo dashboard → Account → is it in production mode?
 *   - Brevo dashboard → Senders/API → is the From verified?
 *   - Brevo dashboard → Statistics/Logs → what happened to the message?
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { resolveSender, sendExamPlatMail } = require("../utils/mailSender");

const to = process.env.BREVO_CC_EMAIL;
const from = resolveSender();

console.log("─".repeat(60));
console.log("API key  :", process.env.BREVO_API_KEY ? "✓ set" : "✗ MISSING");
console.log("From      :", from);
console.log("To        :", to);
console.log("─".repeat(60));

if (!to) {
  console.error("✗ BREVO_CC_EMAIL is not set in server/.env (or your environment).");
  process.exit(1);
}

(async () => {
  try {
    const result = await sendExamPlatMail({
      senderLabel: "ExamPlat Mail Test",
      to,
      subject: "ExamPlat mail self-test",
      html: [
        "<div style='font-family:sans-serif;padding:24px;background:#f5f6fa'>",
        "<h2 style='color:#0f4c81'>ExamPlat mail self-test ✅</h2>",
        `<p>Sent from <strong>${from}</strong> to <strong>${to}</strong> at ${new Date().toLocaleString("en-IN")}.</p>`,
        "<p>If you can read this, Brevo delivered it. If not, check the Brevo dashboard (sandbox mode / sender verification / delivery logs).</p>",
        "</div>",
      ].join(""),
    });

    console.log("✔ ACCEPTED - Brevo API accepted the mail.");
    if (result && result.messageId) {
      console.log("  messageId:", result.messageId);
    }
    console.log(
      "  Next: check the inbox/junk for the message, and Brevo Statistics → Logs for delivery status."
    );
  } catch (err) {
    console.log("✗ FAILED - the relay rejected or the send threw:");
    console.log(
      "  ",
      err.responseCode || "ERR",
      (err.response || err.message || "").toString().split("\n")[0]
    );
    process.exit(1);
  }
})();