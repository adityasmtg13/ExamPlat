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
  slate: "#475569",
  muted: "#64748b",
  border: "#e2e8f0",
  panel: "#f8fafc",
};

/**
 * Builds the receipt PDF.
 * Returns a PDFDocument instance.
 */
const createReceiptDocument = (data) => {
  const doc = new PDFDocument({
    margin: 48,
    size: "A4",
    info: {
      Title: `Payment Receipt - ${data.receiptNumber}`,
      Author: "ExamPlat - e-Examination Platform",
      Subject: "Payment Receipt",
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
    .text("Official student examination registration and payment receipt", startX + 66, 58);

  doc
    .roundedRect(pageWidth - 174, 34, 126, 30, 15)
    .fillColor("#dcfce7")
    .fill();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#166534")
    .text(data.payment.status || "Paid", pageWidth - 174, 44, {
      width: 126,
      align: "center",
    });

  // Receipt title
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
    .text("Payment Receipt", startX + 20, 151);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(colors.muted)
    .text("Receipt Number", pageWidth - 238, 150, {
      width: 170,
      align: "right",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.blue)
    .text(data.receiptNumber, pageWidth - 238, 167, {
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
  labelValue("Amount Paid", `₹${data.payment.amount}`, startX + 14, cardY + 13, cardWidth - 28);

  doc
    .roundedRect(startX + cardWidth + cardGap, cardY, cardWidth, 62, 10)
    .fillColor(colors.panel)
    .fill();
  labelValue(
    "Payment Method",
    data.payment.paymentMethod,
    startX + cardWidth + cardGap + 14,
    cardY + 13,
    cardWidth - 28
  );

  doc
    .roundedRect(startX + (cardWidth + cardGap) * 2, cardY, cardWidth, 62, 10)
    .fillColor(colors.panel)
    .fill();
  labelValue(
    "Paid On",
    new Date(data.payment.paidAt).toLocaleString("en-IN"),
    startX + (cardWidth + cardGap) * 2 + 14,
    cardY + 13,
    cardWidth - 28
  );

  addInfoCard(
    "Payment Details",
    [
      ["Payment Number", data.payment.paymentNumber],
      ["Transaction ID", data.payment.transactionId],
      ["Payment Status", data.payment.status],
    ],
    startX,
    320,
    contentWidth
  );

  const halfGap = 16;
  const halfWidth = (contentWidth - halfGap) / 2;

  addInfoCard(
    "Student Details",
    [
      ["Student Name", data.student.name],
      ["Student Email", data.student.email],
    ],
    startX,
    470,
    halfWidth
  );

  addInfoCard(
    "Registration Details",
    [
      ["Registration No.", data.registration.registrationNumber],
      ["Examination", data.registration.examType],
    ],
    startX + halfWidth + halfGap,
    470,
    halfWidth
  );

  doc
    .roundedRect(startX, 606, contentWidth, 64, 10)
    .fillColor("#eff6ff")
    .fill()
    .strokeColor("#bfdbfe")
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(colors.blue)
    .text("Important Note", startX + 16, 623);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.slate)
    .text(
      "Please keep this receipt for future reference. Quote the receipt number for payment or registration support.",
      startX + 16,
      641,
      { width: contentWidth - 32 }
    );

  // Footer
  const footerY = 710;
  drawDivider(footerY);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.muted)
    .text(
      "This is a computer-generated receipt and does not require a signature.",
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
const generateReceiptBuffer = (data) => {
  return new Promise((resolve, reject) => {
    const doc = createReceiptDocument(data);

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
 * Used by receipt download endpoint.
 */
const generateReceipt = async (data, res) => {
  const pdfBuffer = await generateReceiptBuffer(data);

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${data.receiptNumber}.pdf"`
  );

  res.send(pdfBuffer);
};

module.exports = {
  generateReceipt,
  generateReceiptBuffer,
};
