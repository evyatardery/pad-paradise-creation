/**
 * VectorPdfProcessor — takes a source vector PDF and produces a print-ready PDF
 * sized to the exact pad dimensions + 5mm bleed + vector crop marks.
 * Uses pdf-lib to preserve vector quality (no rasterization).
 */
import { PDFDocument, rgb } from "pdf-lib";
import padzoneLogoUrl from "@/assets/padzone-logo.png";

const BLEED_MM = 5;
const MARK_LEN = 8;
const MARK_OFFSET = 1;
const LOGO_WIDTH_MM = 25; // Logo width on the pad
const LOGO_MARGIN_MM = 25; // 2.5cm from bottom-left corner

/** mm to PDF points (1mm = 2.83465pt) */
const mmToPt = (mm: number) => mm * 2.83465;

export interface VectorPrintOptions {
  sourcePdfUrl: string;
  widthMm: number;
  heightMm: number;
}

export interface VectorPrintResult {
  blob: Blob;
  filename: string;
}

/**
 * Draw vector crop marks at trim box corners.
 */
function drawCropMarks(
  page: ReturnType<PDFDocument["addPage"]>,
  trimL: number,
  trimT: number,
  trimR: number,
  trimB: number
) {
  const len = mmToPt(MARK_LEN);
  const off = mmToPt(MARK_OFFSET);
  const thickness = 1.5;
  const color = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);

  // Draw white outline first for contrast, then black on top
  const drawMark = (x1: number, y1: number, x2: number, y2: number) => {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: thickness + 1.5, color: white });
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
  };

  // Top-left
  drawMark(trimL - off - len, trimT, trimL - off, trimT);
  drawMark(trimL, trimT + off, trimL, trimT + off + len);

  // Top-right
  drawMark(trimR + off, trimT, trimR + off + len, trimT);
  drawMark(trimR, trimT + off, trimR, trimT + off + len);

  // Bottom-left
  drawMark(trimL - off - len, trimB, trimL - off, trimB);
  drawMark(trimL, trimB - off - len, trimL, trimB - off);

  // Bottom-right
  drawMark(trimR + off, trimB, trimR + off + len, trimB);
  drawMark(trimR, trimB - off - len, trimR, trimB - off);
}

/**
 * Process a vector PDF source file into a print-ready PDF with:
 * - Exact pad dimensions + 5mm bleed
 * - Source PDF scaled to cover the full area (including bleed)
 * - Vector crop marks at trim edges
 * - No rasterization — preserves full vector quality
 */
export async function processVectorPdf(options: VectorPrintOptions): Promise<VectorPrintResult> {
  const { sourcePdfUrl, widthMm, heightMm } = options;

  // Page dimensions with bleed (in points)
  const pageWPt = mmToPt(widthMm + 2 * BLEED_MM);
  const pageHPt = mmToPt(heightMm + 2 * BLEED_MM);

  // Trim box edges (in points)
  const trimL = mmToPt(BLEED_MM);
  const trimB = mmToPt(BLEED_MM);
  const trimR = mmToPt(BLEED_MM + widthMm);
  const trimT = mmToPt(BLEED_MM + heightMm);

  // Fetch source PDF
  const response = await fetch(sourcePdfUrl);
  if (!response.ok) throw new Error("Failed to fetch source PDF");
  const sourcePdfBytes = await response.arrayBuffer();

  // Load source and create output
  const sourcePdf = await PDFDocument.load(sourcePdfBytes);
  const outputPdf = await PDFDocument.create();

  // Embed the first page of the source PDF
  const [embeddedPage] = await outputPdf.embedPdf(sourcePdf, [0]);

  // Create output page at exact dimensions
  const page = outputPdf.addPage([pageWPt, pageHPt]);

  // Calculate scaling to cover the full page (including bleed)
  const sourceW = embeddedPage.width;
  const sourceH = embeddedPage.height;
  const scaleX = pageWPt / sourceW;
  const scaleY = pageHPt / sourceH;
  // Use the larger scale to ensure full coverage (cover-fit)
  const scale = Math.max(scaleX, scaleY);

  // Center the scaled source on the page
  const scaledW = sourceW * scale;
  const scaledH = sourceH * scale;
  const offsetX = (pageWPt - scaledW) / 2;
  const offsetY = (pageHPt - scaledH) / 2;

  // Draw the embedded source PDF page (vector quality preserved)
  page.drawPage(embeddedPage, {
    x: offsetX,
    y: offsetY,
    width: scaledW,
    height: scaledH,
  });

  // Draw vector crop marks
  drawCropMarks(page, trimL, trimT, trimR, trimB);

  // Embed transparent logo PNG at bottom-LEFT of trim box
  const logoResponse = await fetch(padzoneLogoUrl);
  if (logoResponse.ok) {
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await outputPdf.embedPng(logoBytes);

    const logoWidthPt = mmToPt(LOGO_WIDTH_MM);
    const logoAspect = logoImage.height / logoImage.width;
    const logoHeightPt = logoWidthPt * logoAspect;
    const logoMarginPt = mmToPt(LOGO_MARGIN_MM);

    // Position: bottom-left of trim box, 2.5cm from corner edges
    const logoX = trimL + logoMarginPt;
    const logoY = trimB + logoMarginPt;

    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoWidthPt,
      height: logoHeightPt,
    });
  }

  // Save without compression
  const outputBytes = await outputPdf.save();
  const blob = new Blob([outputBytes.buffer as ArrayBuffer], { type: "application/pdf" });

  const widthCm = widthMm / 10;
  const heightCm = heightMm / 10;

  return {
    blob,
    filename: `PADZONE_print_${widthCm}x${heightCm}cm_vector.pdf`,
  };
}
