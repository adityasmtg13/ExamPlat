/**
 * Generates the payment confirmation email
 */
const generatePaymentEmail = (
  student,
  registration,
  payment,
  receiptNumber
) => {
  const paidDate = payment.paidAt
    ? new Date(payment.paidAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  return {
    subject: `Payment Confirmation - ${registration.registrationNumber}`,

    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Payment Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f5f6fa;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">

<!-- Header -->
<tr>
<td
style="background:#0f4c81;color:#ffffff;padding:25px;text-align:center;">
<h1 style="margin:0;font-size:28px;">
🇮🇳 ExamPlat
</h1>

<p style="margin-top:10px;font-size:15px;">
National Examination Platform
</p>
</td>
</tr>

<!-- Success Banner -->
<tr>
<td
style="background:#22c55e;color:#ffffff;text-align:center;padding:18px;">
<h2 style="margin:0;">
✅ Payment Successful
</h2>
</td>
</tr>

<!-- Greeting -->
<tr>
<td style="padding:35px;">

<p style="font-size:16px;">
Dear <strong>${student.fullName}</strong>,
</p>

<p style="font-size:15px;line-height:1.8;color:#444;">
Your payment has been received successfully.
Your examination registration has been confirmed.
</p>

<h3 style="color:#0f4c81;">
Payment Details
</h3>

<table
width="100%"
cellpadding="10"
cellspacing="0"
style="border-collapse:collapse;border:1px solid #ddd;">

<tr>
<td style="background:#f5f5f5;"><strong>Receipt Number</strong></td>
<td>${receiptNumber}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Registration Number</strong></td>
<td>${registration.registrationNumber}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Payment Number</strong></td>
<td>${payment.paymentNumber}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Transaction ID</strong></td>
<td>${payment.transactionId}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Examination</strong></td>
<td>${registration.examType}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Amount Paid</strong></td>
<td>₹${payment.amount}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Payment Method</strong></td>
<td>${payment.paymentMethod}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Status</strong></td>
<td style="color:green;font-weight:bold;">
${payment.status}
</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Payment Date</strong></td>
<td>${paidDate}</td>
</tr>

</table>

<br>

<div
style="background:#eef9f1;border-left:5px solid #22c55e;padding:18px;">

<strong>Receipt Attached</strong>

<p style="margin-top:10px;line-height:1.7;">
The official payment receipt has been attached to this email
for your future reference.
</p>

</div>

<br>

<p style="line-height:1.8;">
Thank you for choosing
<strong>ExamPlat</strong>.

We wish you success in your upcoming examination.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td
style="background:#0f4c81;color:#ffffff;padding:20px;text-align:center;">

<p style="margin:0;">
ExamPlat • National Examination Platform
</p>

<p style="margin-top:8px;font-size:13px;">
This is an automated email.
Please do not reply to this message.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  };
};

module.exports = generatePaymentEmail;