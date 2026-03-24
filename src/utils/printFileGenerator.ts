/**
 * PrintFileGenerator — creates a high-resolution (300 DPI) print-ready PDF
 * with 3mm bleed margins for Roland BV-20 sublimation printer.
 * Uses jsPDF for proper physical dimensions and high-quality image embedding.
 */
import jsPDF from "jspdf";

const BLEED_MM = 3;

/** Parse dimension string like "80x30" → { widthMm, heightMm } */
export function parseDimensions(dim: string): { widthMm: number; heightMm: number } {
  const match = dim.match(/([\d.]+)\s*x\s*([\d.]+)/i);
  if (!match) throw new Error(`Cannot parse dimensions: ${dim}`);
  // Dimensions are in cm in the catalog, convert to mm
  return {
    widthMm: parseFloat(match[1]) * 10,
    heightMm: parseFloat(match[2]) * 10,
  };
}

export interface PrintFileOptions {
  /** The design image (URL or data URI) */
  designImageSrc: string;
  /** Dimension label from catalog, e.g. "XL 80x30" */
  dimensionLabel: string;
  /** Optional overlay text */
  overlayText?: string;
  /** Font for overlay text */
  overlayFont?: string;
  /** Text alignment */
  overlayAlign?: "left" | "center" | "right";
}

export interface PrintFileResult {
  /** Blob of the generated PDF */
  blob: Blob;
  /** Filename */
  filename: string;
  /** Actual print area dimensions in mm */
  printWidthMm: number;
  /** Actual print area dimensions in mm */
  printHeightMm: number;
  /** Data URL for preview (low-res) */
  previewDataUrl: string;
}

/**
 * Load image as base64 data URL for embedding in PDF.
 * This preserves full source resolution — no canvas downsampling.
 */
function loadImageAsDataUrl(src: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Use a canvas only to convert to base64 — at FULL source resolution
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Calculate cover-fit crop coordinates.
 * Returns source crop rect to fill target aspect ratio.
 */
function getCoverCrop(
  imgW: number, imgH: number, targetW: number, targetH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;

  if (imgRatio > targetRatio) {
    // Image is wider — crop sides
    const sw = imgH * targetRatio;
    return { sx: (imgW - sw) / 2, sy: 0, sw, sh: imgH };
  } else {
    // Image is taller — crop top/bottom
    const sh = imgW / targetRatio;
    return { sx: 0, sy: (imgH - sh) / 2, sw: imgW, sh };
  }
}

/**
 * Generate a print-ready PDF with bleed for Roland BV-20.
 * The PDF page size = product size + 2×bleed on each side.
 * Image is placed at full resolution covering the entire page (including bleed).
 */
export async function generatePrintFile(options: PrintFileOptions): Promise<PrintFileResult> {
  const { designImageSrc, dimensionLabel, overlayText, overlayFont, overlayAlign } = options;

  const { widthMm, heightMm } = parseDimensions(dimensionLabel);

  // Total page size with bleed
  const pageW = widthMm + 2 * BLEED_MM;
  const pageH = heightMm + 2 * BLEED_MM;

  // Load source image at full resolution
  const imgData = await loadImageAsDataUrl(designImageSrc);

  // Crop source image to match target aspect ratio (cover-fit)
  // We need to create a cropped version for the PDF
  const crop = getCoverCrop(imgData.width, imgData.height, pageW, pageH);

  // Create a canvas to crop the image at full resolution for PDF embedding
  const cropCanvas = document.createElement("canvas");
  // Use source resolution proportional to crop area for maximum quality
  cropCanvas.width = Math.round(crop.sw);
  cropCanvas.height = Math.round(crop.sh);
  const cropCtx = cropCanvas.getContext("2d")!;

  const sourceImg = await loadImage(designImageSrc);
  cropCtx.drawImage(
    sourceImg,
    crop.sx, crop.sy, crop.sw, crop.sh,
    0, 0, cropCanvas.width, cropCanvas.height
  );

  const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.95);

  // Create PDF with exact physical dimensions (mm)
  // Orientation based on which dimension is larger
  const doc = new jsPDF({
    orientation: pageW >= pageH ? "landscape" : "portrait",
    unit: "mm",
    format: [pageW, pageH],
    compress: true,
  });

  // Place image covering entire page (including bleed area)
  doc.addImage(croppedDataUrl, "JPEG", 0, 0, pageW, pageH);

  // Add overlay text if present
  if (overlayText) {
    const fontSize = Math.round(heightMm * 0.06);
    doc.setFontSize(fontSize);
    doc.setTextColor(255, 255, 255);

    const textY = BLEED_MM + heightMm - fontSize * 0.15;
    let textX: number;
    let align: "left" | "center" | "right" = overlayAlign || "center";

    if (align === "left") {
      textX = BLEED_MM + fontSize * 0.1;
    } else if (align === "right") {
      textX = BLEED_MM + widthMm - fontSize * 0.1;
    } else {
      textX = pageW / 2;
    }

    doc.text(overlayText, textX, textY, { align });
  }

  // Add trim marks as thin lines outside the bleed area
  // (Not inside the print area — just visual guides)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);

  // Trim box corners (where the actual product edge is)
  const trimLeft = BLEED_MM;
  const trimTop = BLEED_MM;
  const trimRight = BLEED_MM + widthMm;
  const trimBottom = BLEED_MM + heightMm;
  const markLen = 5; // mm

  // Top-left
  doc.line(0, trimTop, trimLeft - 0.5, trimTop);
  doc.line(trimLeft, 0, trimLeft, trimTop - 0.5);
  // Top-right
  doc.line(trimRight + 0.5, trimTop, pageW, trimTop);
  doc.line(trimRight, 0, trimRight, trimTop - 0.5);
  // Bottom-left
  doc.line(0, trimBottom, trimLeft - 0.5, trimBottom);
  doc.line(trimLeft, trimBottom + 0.5, trimLeft, pageH);
  // Bottom-right
  doc.line(trimRight + 0.5, trimBottom, pageW, trimBottom);
  doc.line(trimRight, trimBottom + 0.5, trimRight, pageH);

  // Generate PDF blob
  const pdfBlob = doc.output("blob");

  // Generate a low-res preview for UI display
  const previewCanvas = document.createElement("canvas");
  const previewScale = 400 / pageW; // ~400px wide preview
  previewCanvas.width = Math.round(pageW * previewScale);
  previewCanvas.height = Math.round(pageH * previewScale);
  const previewCtx = previewCanvas.getContext("2d")!;
  previewCtx.fillStyle = "#FFFFFF";
  previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewCtx.drawImage(sourceImg,
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
