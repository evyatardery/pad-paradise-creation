/**
 * VectorPdfProcessor — takes a source vector PDF and produces a print-ready PDF
 * sized to the exact pad dimensions + 5mm bleed + vector crop marks.
 * Uses pdf-lib to preserve vector quality (no rasterization).
 */
import { PDFDocument, rgb } from "pdf-lib";

const BLEED_MM = 5;
const MARK_LEN = 5;
const MARK_OFFSET = 0.5;

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
  const thickness = 0.5;
  const color = rgb(0, 0, 0);

  // Top-left
  page.drawLine({ start: { x: trimL - off - len, y: trimT }, end: { x: trimL - off, y: trimT }, thickness, color });
  page.drawLine({ start: { x: trimL, y: trimT + off }, end: { x: trimL, y: trimT + off + len }, thickness, color });

  // Top-right
  page.drawLine({ start: { x: trimR + off, y: trimT }, end: { x: trimR + off + len, y: trimT }, thickness, color });
  page.drawLine({ start: { x: trimR, y: trimT + off }, end: { x: trimR, y: trimR + off + len }, thickness, color });

  // Bottom-left
  page.drawLine({ start: { x: trimL - off - len, y: trimB }, end: { x: trimL - off, y: trimB }, thickness, color });
  page.drawLine({ start: { x: trimL, y: trimB - off - len }, end: { x: trimL, y: trimB - off }, thickness, color });

  // Bottom-right
  page.drawLine({ start: { x: trimR + off, y: trimB }, end: { x: trimR + off + len, y: trimB }, thickness, color });
  page.drawLine({ start: { x: trimR, y: trimB - off - len }, end: { x: trimR, y: trimB - off }, thickness, color });
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

  // Save without compression
  const outputBytes = await outputPdf.save();
  const blob = new Blob([outputBytes], { type: "application/pdf" });

  const widthCm = widthMm / 10;
  const heightCm = heightMm / 10;

  return {
    blob,
    filename: `PADZONE_print_${widthCm}x${heightCm}cm_vector.pdf`,
  };
}
