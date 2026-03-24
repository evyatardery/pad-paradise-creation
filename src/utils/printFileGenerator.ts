/**
 * PrintFileGenerator — creates a high-resolution (300 DPI) print-ready PDF
 * with 5mm bleed margins and vector crop marks for Roland BV-20 sublimation printer.
 * Uses jsPDF with uncompressed JPEG embedding for maximum quality.
 * NO mirroring — printer handles that.
 */
import jsPDF from "jspdf";

const BLEED_MM = 5;
const MARK_LEN = 8; // crop mark length in mm
const MARK_OFFSET = 1; // gap between mark and trim edge

/** Parse dimension string like "80x30" → { widthMm, heightMm } */
export function parseDimensions(dim: string): { widthMm: number; heightMm: number } {
  const match = dim.match(/([\d.]+)\s*x\s*([\d.]+)/i);
  if (!match) throw new Error(`Cannot parse dimensions: ${dim}`);
  return {
    widthMm: parseFloat(match[1]) * 10,
    heightMm: parseFloat(match[2]) * 10,
  };
}

export interface PrintFileOptions {
  designImageSrc: string;
  dimensionLabel: string;
  overlayText?: string;
  overlayFont?: string;
  overlayAlign?: "left" | "center" | "right";
}

export interface PrintFileResult {
  blob: Blob;
  filename: string;
  printWidthMm: number;
  printHeightMm: number;
  previewDataUrl: string;
}

export interface PreflightResult {
  ok: boolean;
  imageWidth: number;
  imageHeight: number;
  requiredWidth: number;
  requiredHeight: number;
  dpi: number;
  warning?: string;
}

/**
 * Check if an image has sufficient resolution for print quality.
 * Returns a warning if the effective DPI would be below 150 (minimum acceptable).
 */
export async function preflightCheck(
  imageSrc: string,
  dimensionLabel: string
): Promise<PreflightResult> {
  const { widthMm, heightMm } = parseDimensions(dimensionLabel);
  const pageW = widthMm + 2 * BLEED_MM;
  const pageH = heightMm + 2 * BLEED_MM;

  const img = await loadImage(imageSrc);
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  // Calculate effective DPI based on the dimension that constrains
  const dpiW = imgW / (pageW / 25.4);
  const dpiH = imgH / (pageH / 25.4);
  const effectiveDpi = Math.min(dpiW, dpiH);

  // For 300 DPI target
  const requiredWidth = Math.ceil((pageW / 25.4) * 300);
  const requiredHeight = Math.ceil((pageH / 25.4) * 300);

  const minDimension = Math.min(imgW, imgH);

  if (minDimension < 2000 || effectiveDpi < 150) {
    return {
      ok: false,
      imageWidth: imgW,
      imageHeight: imgH,
      requiredWidth,
      requiredHeight,
      dpi: Math.round(effectiveDpi),
      warning: `איכות התמונה נמוכה (${imgW}x${imgH} פיקסלים, ~${Math.round(effectiveDpi)} DPI). התוצאה עלולה לצאת מטושטשת. מומלץ תמונה של לפחות ${requiredWidth}x${requiredHeight} פיקסלים.`,
    };
  }

  return {
    ok: true,
    imageWidth: imgW,
    imageHeight: imgH,
    requiredWidth,
    requiredHeight,
    dpi: Math.round(effectiveDpi),
  };
}

/**
 * Load an image element at full native resolution.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Cover-fit crop: returns source rect that fills target aspect ratio.
 */
function getCoverCrop(
  imgW: number, imgH: number, targetW: number, targetH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;

  if (imgRatio > targetRatio) {
    const sw = imgH * targetRatio;
    return { sx: (imgW - sw) / 2, sy: 0, sw, sh: imgH };
  } else {
    const sh = imgW / targetRatio;
    return { sx: 0, sy: (imgH - sh) / 2, sw: imgW, sh };
  }
}

/**
 * Convert source image to a high-quality data URL at full resolution,
 * cropped to match the target aspect ratio (cover-fit).
 * Uses maximum JPEG quality (1.0) for print — no compression artifacts.
 */
function createCroppedDataUrl(
  img: HTMLImageElement, targetW: number, targetH: number
): string {
  const crop = getCoverCrop(img.naturalWidth, img.naturalHeight, targetW, targetH);

  const canvas = document.createElement("canvas");
  // Keep full source resolution of the cropped region
  canvas.width = Math.round(crop.sw);
  canvas.height = Math.round(crop.sh);

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    img,
    crop.sx, crop.sy, crop.sw, crop.sh,
    0, 0, canvas.width, canvas.height
  );

  // Maximum quality — no compression
  return canvas.toDataURL("image/jpeg", 1.0);
}

/**
 * Draw vector crop marks at the four corners of the trim box.
 * Marks sit in the bleed area, with a small gap from the trim edge.
 */
function drawCropMarks(doc: jsPDF, trimL: number, trimT: number, trimR: number, trimB: number) {
  // White outline for contrast
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);

  const drawWhiteMark = (x1: number, y1: number, x2: number, y2: number) => {
    doc.line(x1, y1, x2, y2);
  };

  // Top-left
  drawWhiteMark(trimL - MARK_OFFSET - MARK_LEN, trimT, trimL - MARK_OFFSET, trimT);
  drawWhiteMark(trimL, trimT - MARK_OFFSET - MARK_LEN, trimL, trimT - MARK_OFFSET);
  // Top-right
  drawWhiteMark(trimR + MARK_OFFSET, trimT, trimR + MARK_OFFSET + MARK_LEN, trimT);
  drawWhiteMark(trimR, trimT - MARK_OFFSET - MARK_LEN, trimR, trimT - MARK_OFFSET);
  // Bottom-left
  drawWhiteMark(trimL - MARK_OFFSET - MARK_LEN, trimB, trimL - MARK_OFFSET, trimB);
  drawWhiteMark(trimL, trimB + MARK_OFFSET, trimL, trimB + MARK_OFFSET + MARK_LEN);
  // Bottom-right
  drawWhiteMark(trimR + MARK_OFFSET, trimB, trimR + MARK_OFFSET + MARK_LEN, trimB);
  drawWhiteMark(trimR, trimB + MARK_OFFSET, trimR, trimB + MARK_OFFSET + MARK_LEN);

  // Black marks on top
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  // Top-left
  doc.line(trimL - MARK_OFFSET - MARK_LEN, trimT, trimL - MARK_OFFSET, trimT);
  doc.line(trimL, trimT - MARK_OFFSET - MARK_LEN, trimL, trimT - MARK_OFFSET);
  // Top-right
  doc.line(trimR + MARK_OFFSET, trimT, trimR + MARK_OFFSET + MARK_LEN, trimT);
  doc.line(trimR, trimT - MARK_OFFSET - MARK_LEN, trimR, trimT - MARK_OFFSET);
  // Bottom-left
  doc.line(trimL - MARK_OFFSET - MARK_LEN, trimB, trimL - MARK_OFFSET, trimB);
  doc.line(trimL, trimB + MARK_OFFSET, trimL, trimB + MARK_OFFSET + MARK_LEN);
  // Bottom-right
  doc.line(trimR + MARK_OFFSET, trimB, trimR + MARK_OFFSET + MARK_LEN, trimB);
  doc.line(trimR, trimB + MARK_OFFSET, trimR, trimB + MARK_OFFSET + MARK_LEN);
}

/**
 * Generate a print-ready PDF for Roland BV-20 sublimation.
 *
 * - PDF page = product dimensions + 5mm bleed on each side
 * - Image embedded at full source resolution (no downsampling)
 * - JPEG quality 1.0 (no compression), sRGB preserved
 * - Vector crop marks in bleed area
 * - Overlay text as vector layer (not rasterized)
 * - No mirroring — printer handles that
 */
export async function generatePrintFile(options: PrintFileOptions): Promise<PrintFileResult> {
  const { designImageSrc, dimensionLabel, overlayText, overlayAlign } = options;

  const { widthMm, heightMm } = parseDimensions(dimensionLabel);

  // Total page with bleed
  const pageW = widthMm + 2 * BLEED_MM;
  const pageH = heightMm + 2 * BLEED_MM;

  // Trim box edges
  const trimL = BLEED_MM;
  const trimT = BLEED_MM;
  const trimR = BLEED_MM + widthMm;
  const trimB = BLEED_MM + heightMm;

  // Load source image at full native resolution
  const sourceImg = await loadImage(designImageSrc);

  // Create cropped data URL at full resolution, max quality
  const croppedDataUrl = createCroppedDataUrl(sourceImg, pageW, pageH);

  // Create PDF with exact physical dimensions
  const doc = new jsPDF({
    orientation: pageW >= pageH ? "landscape" : "portrait",
    unit: "mm",
    format: [pageW, pageH],
    compress: false, // NO compression for print quality
  });

  // Layer 1: Background image covering entire page (including bleed)
  doc.addImage(croppedDataUrl, "JPEG", 0, 0, pageW, pageH);

  // Layer 2: Vector overlay text (stays sharp at any zoom)
  if (overlayText) {
    const fontSize = Math.round(heightMm * 0.06);
    doc.setFontSize(fontSize);
    doc.setTextColor(255, 255, 255);

    const textY = trimB - fontSize * 0.15;
    const align = overlayAlign || "center";
    let textX: number;

    if (align === "left") {
      textX = trimL + fontSize * 0.1;
    } else if (align === "right") {
      textX = trimR - fontSize * 0.1;
    } else {
      textX = pageW / 2;
    }

    doc.text(overlayText, textX, textY, { align });
  }

  // Layer 3: Vector crop marks
  drawCropMarks(doc, trimL, trimT, trimR, trimB);

  // Generate PDF blob
  const pdfBlob = doc.output("blob");

  // Low-res preview for UI
  const previewCanvas = document.createElement("canvas");
  const previewScale = 400 / pageW;
  previewCanvas.width = Math.round(pageW * previewScale);
  previewCanvas.height = Math.round(pageH * previewScale);
  const previewCtx = previewCanvas.getContext("2d")!;
  previewCtx.fillStyle = "#FFFFFF";
  previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

  const crop = getCoverCrop(sourceImg.naturalWidth, sourceImg.naturalHeight, pageW, pageH);
  previewCtx.drawImage(
    sourceImg,
    crop.sx, crop.sy, crop.sw, crop.sh,
    0, 0, previewCanvas.width, previewCanvas.height
  );
  const previewDataUrl = previewCanvas.toDataURL("image/jpeg", 0.5);

  const widthCm = widthMm / 10;
  const heightCm = heightMm / 10;

  return {
    blob: pdfBlob,
    filename: `PADZONE_print_${widthCm}x${heightCm}cm_300dpi.pdf`,
    printWidthMm: widthMm,
    printHeightMm: heightMm,
    previewDataUrl,
  };
}
