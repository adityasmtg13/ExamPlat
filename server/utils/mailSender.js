const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

/**
 * Resolve the "From" address every ExamPlat mail is sent from.
 *
 * Honors BREVO_FROM_EMAIL verbatim (it must be registered/verified as a
 * sender in the Brevo dashboard — e.g. an individually verified address or
 * a verified domain). Falls back to BREVO_SENDER_EMAIL, then a default.
 */
const resolveSender = () => {
  const custom = process.env.BREVO_FROM_EMAIL;
  if (custom) return custom;
  return process.env.BREVO_SENDER_EMAIL || "noreply@examplat.in";
};

const resolveSenderName = () =>
  process.env.BREVO_FROM_NAME || "ExamPlat";

/**
 * Shared send helper used by every mail flow (registration OTP, forgot
 * password, profile changes, payment receipts, mock results). Centralizing
 * here keeps the "From" address valid and the recipient lists hardened
 * (no `[undefined]` cc/to entries), so one fix applies to all mails.
 *
 * Uses Brevo's HTTP API (https://api.brevo.com/v3/smtp/email) instead of
 * SMTP so it works on hosts (e.g. Vercel serverless) that block mail ports.
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

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set.");
  }

  const senderEmail = from || resolveSender();

  const payload = {
    sender: { name: senderLabel || resolveSenderName(), email: senderEmail },
    to: toList.map((email) => ({ email })),
    subject,
    htmlContent: html,
  };

  if (ccList.length) {
    payload.cc = ccList.map((email) => ({ email }));
  }

  if (attachments && attachments.length) {
    payload.attachment = attachments.map((a) => ({
      name: a.filename || a.name || "attachment",
      content: Buffer.isBuffer(a.content)
        ? a.content.toString("base64")
        : Buffer.from(String(a.content || ""), "utf8").toString("base64"),
    }));
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errText = "";
    try {
      errText = await response.text();
    } catch {
      /* ignore */
    }
    const err = new Error(
      `Brevo API error ${response.status}: ${errText}`
    );
    err.responseCode = response.status;
    err.response = errText;
    throw err;
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

module.exports = {
  resolveSender,
  resolveSenderName,
  sendExamPlatMail,
};