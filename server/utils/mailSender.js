const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

/**
 * Resolve the "From" address every ExamPlat mail is sent from.
 *
 * Honors BREVO_FROM_EMAIL verbatim (it must be registered/verified as a
 * sender in the Brevo dashboard — e.g. an individually verified address or
 * a verified domain). Falls back to the Brevo SMTP login address, which is
 * always allowed.
 */
const resolveSender = () => {
  const custom = process.env.BREVO_FROM_EMAIL;
  if (custom) return custom;
  return process.env.BREVO_SMTP_USER || "noreply@examplat.in";
};

/**
 * Shared send helper used by every mail flow (registration OTP, forgot
 * password, profile changes, payment receipts, mock results). Centralizing
 * here keeps the "From" address valid and the recipient lists hardened
 * (no `[undefined]` cc/to entries), so one fix applies to all mails.
 */
const sendExamPlatMail = async ({
  to,
  cc,
  subject,
  html,
  attachments,
  senderLabel = "ExamPlat",
  from,
}) => {
  const toList = (Array.isArray(to) ? to : [to])
    .map(normalizeEmail)
    .filter(Boolean);
  const ccList = (Array.isArray(cc) ? cc : [cc])
    .map(normalizeEmail)
    .filter(Boolean);

  if (!toList.length) {
    throw new Error("No recipient email provided.");
  }

  return transporter.sendMail({
    from: `"${senderLabel}" <${from || resolveSender()}>`,
    to: toList,
    cc: ccList.length ? ccList : undefined,
    subject,
    html,
    attachments,
  });
};

module.exports = Object.assign(transporter, {
  resolveSender,
  sendExamPlatMail,
});