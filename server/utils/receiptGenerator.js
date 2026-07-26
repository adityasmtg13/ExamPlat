const PDFDocument = require("pdfkit");

/**
 * Builds the receipt PDF.
 * Returns a PDFDocument instance.
 */
const createReceiptDocument = (data) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  // Title
  doc
    .fontSize(22)
    .fillColor("#0f4c81")
    .text("ExamPlat", {
      align: "center",
    });

  doc
    .fontSize(14)
    .fillColor("black")
    .text("National Examination Platform", {
      align: "center",
    });

  doc.moveDown(2);

  doc
    .fontSize(18)
    .fillColor("#16a34a")
    .text("Payment Receipt", {
      align: "center",
    });

  doc.moveDown(2);

  const addField = (label, value) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`${label}:`, {
        continued: true,
        width: 180,
      })
      .font("Helvetica-Bold")
      .text(` ${value}`);

    doc.font("Helvetica");

    doc.moveDown(0.7);
  };

  addField("Receipt Number", data.receiptNumber);
  addField("Payment Number", data.payment.paymentNumber);
  addField("Transaction ID", data.payment.transactionId);
  addField("Student Name", data.student.fullName);
  addField("Student Email", data.student.email);
  addField(
    "Registration Number",
    data.registration.registrationNumber
  );
  addField("Examination", data.registration.examType);
  addField("Registration Fee", `₹${data.payment.amount}`);
  addField("Payment Method", data.payment.paymentMethod);
  addField("Payment Status", data.payment.status);

  addField(
    "Paid On",
    new Date(data.payment.paidAt).toLocaleString("en-IN")
  );

  doc.moveDown(2);

  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "This is a computer-generated receipt and does not require a signature.",
      {
        align: "center",
      }
    );

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