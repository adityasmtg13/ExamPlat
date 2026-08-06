/**
 * Generates the mock result email
 */
const generateMockResultEmail = (student, result) => {
  const submittedDate = result.submittedAt
    ? new Date(result.submittedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  const badge = (() => {
    if (result.percentage >= 90) return "Outstanding";
    if (result.percentage >= 80) return "Excellent";
    if (result.percentage >= 70) return "Very Good";
    if (result.percentage >= 60) return "Good";
    if (result.percentage >= 40) return "Average";
    return "Needs Improvement";
  })();

  return {
    subject: `Mock Test Result - ${result.testTitle || result.examType || "Mock Test"}`,

    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Mock Test Result</title>
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
 ExamPlat
</h1>

<p style="margin-top:10px;font-size:15px;">
ExamPlat - e-Examination Platform
</p>
</td>
</tr>

<!-- Result Banner -->
<tr>
<td
style="background:#0891b2;color:#ffffff;text-align:center;padding:18px;">
<h2 style="margin:0;">
📊 Mock Test Result
</h2>
</td>
</tr>

<!-- Greeting -->
<tr>
<td style="padding:35px;">

<p style="font-size:16px;">
Dear <strong>${student.name}</strong>,
</p>

<p style="font-size:15px;line-height:1.8;color:#444;">
Your mock test has been submitted successfully.
Please find your detailed result below and the PDF report attached to this email.
</p>

<h3 style="color:#0f4c81;">
Exam Information
</h3>

<table
width="100%"
cellpadding="10"
cellspacing="0"
style="border-collapse:collapse;border:1px solid #ddd;">

<tr>
<td style="background:#f5f5f5;"><strong>Exam</strong></td>
<td>${result.testTitle || result.examType || "--"}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Attempt</strong></td>
<td>${result.attemptNumber} / ${result.maximumAttempts || 1}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Submitted On</strong></td>
<td>${submittedDate}</td>
</tr>

</table>

<br>

<h3 style="color:#0f4c81;">
Performance Summary
</h3>

<table
width="100%"
cellpadding="10"
cellspacing="0"
style="border-collapse:collapse;border:1px solid #ddd;">

<tr>
<td style="background:#f5f5f5;"><strong>Score</strong></td>
<td>${result.score} / ${result.totalMarks}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Percentage</strong></td>
<td style="font-weight:bold;color:#0891b2;">
${result.percentage.toFixed(2)}%
</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Correct Answers</strong></td>
<td style="color:green;font-weight:bold;">
${result.correctAnswers}
</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Wrong Answers</strong></td>
<td style="color:red;font-weight:bold;">
${result.wrongAnswers}
</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Unanswered</strong></td>
<td style="color:#d97706;font-weight:bold;">
${result.unanswered}
</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Time Taken</strong></td>
<td>${result.timeTaken ? formatTime(result.timeTaken) : "--"}</td>
</tr>

<tr>
<td style="background:#f5f5f5;"><strong>Performance</strong></td>
<td style="font-weight:bold;color:#0891b2;">
${badge}
</td>
</tr>

</table>

<br>

<div
style="background:#eef9f1;border-left:5px solid #22c55e;padding:18px;">

<strong>Result PDF Attached</strong>

<p style="margin-top:10px;line-height:1.7;">
The detailed mock test result PDF has been attached to this email
for your records and future reference.
</p>

</div>

<br>

<p style="line-height:1.8;">
Thank you for using
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
ExamPlat • ExamPlat - e-Examination Platform
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

const formatTime = (seconds = 0) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }

  return `${mins}m ${secs}s`;
};

module.exports = generateMockResultEmail;