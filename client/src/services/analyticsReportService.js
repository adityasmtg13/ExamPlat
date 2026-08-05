import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";

/**
 * Formats a date as DD-MM-YYYY
 */
const formatDate = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Formats a date-time string for display
 */
const formatDateTime = (date = new Date()) => {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Sanitizes a student name for use in a filename
 */
const sanitizeFileName = (name = "") => {
  return String(name)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "");
};

/**
 * Waits for all <img> elements inside a container to finish loading.
 * html2canvas fails with "Error loading image" or blank charts otherwise.
 */
const waitForImages = (container) => {
  const imgs = container.querySelectorAll("img");

  return Promise.all(
    [...imgs].map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
};

/**
 * Builds a hidden report container with the analytics content
 * styled for PDF output, then captures it with html2canvas.
 *
 * NOTE: Uses flexbox (not CSS grid) because html2canvas does not
 * reliably render CSS Grid inside hidden elements.
 */
const buildReportHTML = ({
  studentName,
  summary,
  chartImages,
}) => {
  const {
    totalAttempts = 0,
    averagePercentage = 0,
    bestPercentage = 0,
    lowestPercentage = 0,
    totalQuestionsAttempted = 0,
    practiceTimeFormatted = "0 min",
  } = summary;

  const metrics = [
    { label: "Total Mock Tests Attempted", value: String(totalAttempts) },
    { label: "Average Percentage", value: `${averagePercentage}%` },
    { label: "Highest Percentage", value: `${bestPercentage}%` },
    { label: "Lowest Percentage", value: `${lowestPercentage}%` },
    { label: "Total Questions Attempted", value: String(totalQuestionsAttempted) },
    { label: "Total Practice Hours", value: practiceTimeFormatted },
  ];

  const chartSections = [
    { title: "Performance Trend", description: "Attempt vs Percentage", image: chartImages.performanceTrend },
    { title: "Exam Attempts", description: "JEE, NEET, CUET, MAT comparison", image: chartImages.examAttempts },
    { title: "Best vs Average Performance", description: "Comparison by exam", image: chartImages.bestVsAverage },
    { title: "Practice Time Distribution", description: "Exam-wise learning time", image: chartImages.practiceDistribution },
    { title: "Overall Performance", description: "Progression across all attempts", image: chartImages.overallPerformance },
  ];

  const metricCards = metrics
    .map(
      (metric) => `
        <div style="box-sizing: border-box; width: 33.333%; padding: 6px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
            <div style="font-size: 9px; color: #64748b;">${metric.label}</div>
            <div style="font-size: 16px; font-weight: bold; color: #051d53; margin-top: 4px;">${metric.value}</div>
          </div>
        </div>
      `
    )
    .join("");

  const chartCards = chartSections
    .map(
      (chart) => `
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid;">
          <div style="font-size: 14px; font-weight: bold; color: #051d53;">${chart.title}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${chart.description}</div>
          ${chart.image ? `<img src="${chart.image}" style="width: 100%; margin-top: 12px;" />` : ""}
        </div>
      `
    )
    .join("");

  return `
    <div id="analytics-report" style="width: 794px; min-height: auto; overflow: visible; background: #ffffff; font-family: Arial, Helvetica, sans-serif; color: #0f172a; padding: 0; margin: 0; box-sizing: border-box;">
      <!-- Header -->
      <div style="background: #afdaf7; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logo}" alt="National Exam Platform Logo" style="width: 48px; height: 48px; object-fit: contain;" />
          <div>
            <div style="font-size: 22px; font-weight: bold; color: #ffffff;">EXAMPLAT</div>
            <div style="font-size: 11px; color: #00060e;">e-Examination Platform</div>
          </div>
        </div>
        <div style="background: #dcfce7; color: #166534; border-radius: 999px; padding: 6px 16px; font-size: 11px; font-weight: bold;">Analytics Report</div>
      </div>

      <!-- Title bar -->
      <div style="margin: 24px 32px 0; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #051d53;">Analytics Dashboard</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Generated on ${formatDateTime()}</div>
        </div>
      </div>

      <!-- Student info -->
      <div style="margin: 16px 32px 0; display: flex; gap: 16px; box-sizing: border-box;">
        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; box-sizing: border-box;">
          <div style="font-size: 10px; font-weight: bold; color: #103f7c; text-transform: uppercase; letter-spacing: 0.05em;">Student Details</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 8px;">Student Name</div>
          <div style="font-size: 13px; font-weight: bold; color: #051d53; margin-top: 2px;">${studentName || "--"}</div>
        </div>
        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; box-sizing: border-box;">
          <div style="font-size: 10px; font-weight: bold; color: #103f7c; text-transform: uppercase; letter-spacing: 0.05em;">Report Information</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 8px;">Date & Time</div>
          <div style="font-size: 12px; font-weight: bold; color: #051d53; margin-top: 2px;">${formatDateTime()}</div>
        </div>
      </div>

      <!-- Performance Summary -->
      <div style="margin: 24px 32px 0; box-sizing: border-box;">
        <div style="font-size: 16px; font-weight: bold; color: #051d53; margin-bottom: 4px;">Performance Summary</div>
        <div style="display: flex; flex-wrap: wrap; margin: -6px; box-sizing: border-box;">
          ${metricCards}
        </div>
      </div>

      <!-- Charts -->
      <div style="margin: 24px 32px 0; box-sizing: border-box;">
        ${chartCards}
      </div>

      <!-- Footer -->
      <div style="margin: 24px 32px 0; border-top: 1px solid #e2e8f0; padding: 16px 0 24px; text-align: center; box-sizing: border-box;">
        <div style="font-size: 10px; color: #64748b;">This is a computer-generated analytics report.</div>
        <div style="font-size: 10px; font-weight: bold; color: #103f7c; margin-top: 4px;">Generated by EXAMPLAT - e-Examination Platform</div>
      </div>
    </div>
  `;
};

/**
 * Captures a DOM element as a PNG data URL using html2canvas
 */
const captureElement = async (element) => {
  if (!element) return null;

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  return canvas.toDataURL("image/png");
};

/**
 * Generates and downloads the analytics report PDF
 *
 * @param {Object} options
 * @param {string} options.studentName - Student's name
 * @param {Object} options.summary - Summary metrics
 * @param {Object} options.chartRefs - Object containing refs to chart DOM elements
 *   { performanceTrend, examAttempts, bestVsAverage, practiceDistribution, overallPerformance }
 */
export const downloadAnalyticsReport = async ({
  studentName = "",
  summary = {},
  chartRefs = {},
}) => {
  let container = null;

  try {
    // Capture all chart images in parallel at high quality
    const [performanceTrendImg, examAttemptsImg, bestVsAverageImg, practiceDistributionImg, overallPerformanceImg] =
      await Promise.all([
        captureElement(chartRefs.performanceTrend),
        captureElement(chartRefs.examAttempts),
        captureElement(chartRefs.bestVsAverage),
        captureElement(chartRefs.practiceDistribution),
        captureElement(chartRefs.overallPerformance),
      ]);

    // Build the report HTML
    const reportHTML = buildReportHTML({
      studentName,
      summary,
      chartImages: {
        performanceTrend: performanceTrendImg,
        examAttempts: examAttemptsImg,
        bestVsAverage: bestVsAverageImg,
        practiceDistribution: practiceDistributionImg,
        overallPerformance: overallPerformanceImg,
      },
    });

    // Create a hidden container and inject the report HTML.
    // IMPORTANT: Do NOT use left: -9999px — html2canvas has known issues
    // rendering elements moved outside the viewport. Use opacity: 0 instead.
    container = document.createElement("div");
    container.innerHTML = reportHTML;
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "-9999";
    document.body.appendChild(container);

    const reportElement = container.querySelector("#analytics-report");

    // Wait for the browser to paint the hidden element before capturing.
    // html2canvas captures an unrendered element if this is skipped.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Wait for every chart <img> inside the report to finish loading.
    // Otherwise html2canvas produces "Error loading image" or blank charts.
    await waitForImages(reportElement);

    // Capture the full report as a single image.
    // windowWidth/windowHeight + scrollX/scrollY ensure the ENTIRE element
    // is rendered (not just the visible viewport portion).
    const reportCanvas = await html2canvas(reportElement, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      windowWidth: reportElement.scrollWidth,
      windowHeight: reportElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });

    const reportImage = reportCanvas.toDataURL("image/png");

    // Create PDF document (A4)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Get image properties to maintain aspect ratio
    const props = doc.getImageProperties(reportImage);
    const imgWidth = pageWidth;
    const imgHeight = (props.height * imgWidth) / props.width;

    // Add the report image to the PDF, splitting across pages without overlap.
    let position = 0;

    doc.addImage(reportImage, "PNG", 0, position, imgWidth, imgHeight);

    let heightLeft = imgHeight - pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(reportImage, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename: Analytics_Report_<StudentName>_<DD-MM-YYYY>.pdf
    const safeName = sanitizeFileName(studentName) || "Student";
    const dateStr = formatDate();
    const fileName = `Analytics_Report_${safeName}_${dateStr}.pdf`;

    // Save the PDF (save() is synchronous in jsPDF)
    doc.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    // Preserve the original error so the real failure is visible
    console.error("Analytics Report Generation Error:", error);
    throw error;
  } finally {
    // Clean up the hidden container
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
  }
};