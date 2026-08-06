const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const logoPath = path.resolve(__dirname, "../../client/src/assets/logo.png");

const colors = {
  lightBlue: "#afdaf7",
  navy: "#051d53",
  blue: "#103f7c",
  cyan: "#0891b2",
  green: "#16a34a",
  red: "#dc2626",
  yellow: "#d97706",
  slate: "#475569",
  muted: "#64748b",
  border: "#e2e8f0",
  panel: "#f8fafc",
};

const getBadge = (percentage) => {
  if (percentage >= 90) return { title: "Outstanding", color: "#16a34a" };
  if (percentage >= 80) return { title: "Excellent", color: "#16a34a" };
  if (percentage >= 70) return { title: "Very Good", color: "#2563eb" };
  if (percentage >= 60) return { title: "Good", color: "#d97706" };
  if (percentage >= 40) return { title: "Average", color: "#ea580c" };
  return { title: "Needs Improvement", color: "#dc2626" };
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

/**
 * Builds the Mock Result PDF.
 * Returns a PDFDocument instance.
 */
const createMockResultDocument = (data) => {
  const { result, student } = data;

  const doc = new PDFDocument({
    margin: 48,
    size: "A4",
    info: {
      Title: `Mock Test Result - ${result.testTitle || "Mock Test"}`,
      Author: "ExamPlat - e-Examination Platform",
      Subject: "Mock Test Result",
    },
  });

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;
  const startX = doc.page.margins.left;

  const drawDivider = (y) => {
    doc
      .moveTo(startX, y)
      .lineTo(startX + contentWidth, y)
      .lineWidth(1)
      .strokeColor(colors.border)
      .stroke();
  };

  const labelValue = (label, value, x, y, width = 235) => {
    doc.font("Helvetica").fontSize(9).fillColor(colors.muted).text(label, x, y, {
      width,
    });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(colors.navy)
      .text(value || "--", x, y + 15, {
        width,
      });
  };

  const addInfoCard = (title, rows, x, y, width) => {
    const rowHeight = 28;
    const cardHeight = 42 + rows.length * rowHeight;

    doc
      .roundedRect(x, y, width, cardHeight, 10)
      .fillColor("#ffffff")
      .fill()
      .strokeColor(colors.border)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.blue)
      .text(title, x + 16, y + 15, { width: width - 32 });

    rows.forEach(([label, value], index) => {
      const rowY = y + 40 + index * rowHeight;

      if (index > 0) {
        doc
          .moveTo(x + 16, rowY - 8)
          .lineTo(x + width - 16, rowY - 8)
          .lineWidth(0.5)
          .strokeColor(colors.border)
          .stroke();
      }

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(colors.slate)
        .text(label, x + 16, rowY, { width: width * 0.38 });

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(colors.navy)
        .text(value || "--", x + width * 0.43, rowY, {
          width: width * 0.5,
          align: "right",
          lineBreak: false,
        });
    });

    return cardHeight;
  };

  const badge = getBadge(result.percentage);

  // Header
  doc.rect(0, 0, pageWidth, 108).fillColor(colors.lightBlue).fill();

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, startX, 28, {
      width: 50,
      height: 50,
      fit: [50, 50],
    });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#ffffff")
    .text("ExamPlat", startX + 66, 31);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#00060e")
    .text("Official mock test result and performance report", startX + 66, 58);

  doc
    .roundedRect(pageWidth - 174, 34, 126, 30, 15)
    .fillColor("#dcfce7")
    .fill();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#166534")
    .text("Completed", pageWidth - 174, 44, {
      width: 126,
      align: "center",
    });

  // Result title
  doc
    .roundedRect(startX, 130, contentWidth, 72, 10)
    .fillColor("#ffffff")
    .fill()
    .strokeColor(colors.border)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(colors.navy)
    .text("Mock Test Result", startX + 20, 151);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.muted)
    .text("Attempt ID", pageWidth - 238, 150, {
      width: 170,
      align: "right",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.blue)
    .text(String(result.attemptId).slice(-8).toUpperCase(), pageWidth - 238, 167, {
      width: 170,
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.muted)
    .text(`Generated on ${new Date().toLocaleString("en-IN")}`, startX + 20, 178);

  // Summary cards
  const cardY = 224;
  const cardGap = 12;
  const cardWidth = (contentWidth - cardGap * 2) / 3;

  doc.roundedRect(startX, cardY, cardWidth, 62, 10).fillColor(colors.panel).fill();
  labelValue("Score", `${result.score} / ${result.totalMarks}`, startX + 14, cardY + 13, cardWidth - 28);

  doc
    .roundedRect(startX + cardWidth + cardGap, cardY, cardWidth, 62, 10)
    .fillColor(colors.panel)
    .fill();
  labelValue(
    "Percentage",
    `${result.percentage.toFixed(2)}%`,
    startX + cardWidth + cardGap + 14,
    cardY + 13,
    cardWidth - 28
  );

  doc
    .roundedRect(startX + (cardWidth + cardGap) * 2, cardY, cardWidth, 62, 10)
    .fillColor(colors.panel)
    .fill();
  labelValue(
    "Time Taken",
    formatTime(result.timeTaken),
    startX + (cardWidth + cardGap) * 2 + 14,
    cardY + 13,
    cardWidth - 28
  );

  // Candidate Information
  addInfoCard(
    "Candidate Information",
    [
      ["Student Name", student?.name || "--"],
      ["Student Email", student?.email || "--"],
      ["Exam", result.testTitle || result.examType || "--"],
      ["Attempt", `${result.attemptNumber} / ${result.maximumAttempts || 1}`],
      ["Submitted On", new Date(result.submittedAt).toLocaleString("en-IN")],
    ],
    startX,
    320,
    contentWidth
  );

  // Statistics
  const statsY = 520;
  const statGap = 12;
  const statWidth = (contentWidth - statGap * 2) / 3;

  doc.roundedRect(startX, statsY, statWidth, 62, 10).fillColor("#f0fdf4").fill();
  labelValue("Correct", String(result.correctAnswers), startX + 14, statsY + 13, statWidth - 28);

  doc
    .roundedRect(startX + statWidth + statGap, statsY, statWidth, 62, 10)
    .fillColor("#fef2f2")
    .fill();
  labelValue(
    "Wrong",
    String(result.wrongAnswers),
    startX + statWidth + statGap + 14,
    statsY + 13,
    statWidth - 28
  );

  doc
    .roundedRect(startX + (statWidth + statGap) * 2, statsY, statWidth, 62, 10)
    .fillColor("#fefce8")
    .fill();
  labelValue(
    "Unanswered",
    String(result.unanswered),
    startX + (statWidth + statGap) * 2 + 14,
    statsY + 13,
    statWidth - 28
  );

  // Performance badge
  doc
    .roundedRect(startX, 640, contentWidth, 64, 10)
    .fillColor("#eff6ff")
    .fill()
    .strokeColor("#bfdbfe")
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(colors.blue)
    .text("Performance", startX + 16, 657);

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(badge.color)
    .text(badge.title, startX + 16, 675, {
      width: contentWidth - 32,
    });

  // Footer
  const footerY = 710;
  drawDivider(footerY);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.muted)
    .text(
      "This is a computer-generated result and does not require a signature.",
      startX,
      footerY + 18,
      { width: contentWidth, align: "center" }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(colors.blue)
    .text("ExamPlat - e-Examination Platform", startX, footerY + 38, {
      width: contentWidth,
      align: "center",
    });

  return doc;
};

/**
 * Generates PDF as a Buffer.
 * Used for email attachments.
 */
const generateMockResultBuffer = (data) => {
  return new Promise((resolve, reject) => {
    const doc = createMockResultDocument(data);

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    doc.end();
  });
};

/**
 * Streams PDF to browser.
 * Used by result download endpoint.
 */
const generateMockResultPdf = async (data, res) => {
  const pdfBuffer = await generateMockResultBuffer(data);

  const filename = `Mock_Result_${data.result.testTitle || "Mock_Test"}_${String(
    data.result.attemptId
  ).slice(-6)}.pdf`
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  res.send(pdfBuffer);
};

module.exports = {
  generateMockResultPdf,
  generateMockResultBuffer,
};