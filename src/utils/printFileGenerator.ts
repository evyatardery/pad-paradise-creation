/**
 * PrintFileGenerator — creates a high-resolution (300 DPI) print-ready canvas
 * with 5mm bleed margins and crop marks for sublimation printing.
 */

const DPI = 300;
const MM_TO_INCH = 25.4;
const BLEED_MM = 5;
const CROP_MARK_LENGTH_MM = 8;
const CROP_MARK_OFFSET_MM = 2;

/** Convert mm to pixels at 300 DPI */
function mmToPx(mm: number): number {
  return Math.round((mm / MM_TO_INCH) * DPI);
}

/** Parse dimension string like "80x30" → { widthMm, heightMm } */
export function parseDimensions(dim: string): { widthMm: number; heightMm: number } {
  // Extract numbers from strings like "XL 80x30", "L 60x30", "M 22.5x18.5"
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
  /** The canvas element with the print file */
  canvas: HTMLCanvasElement;
  /** Blob of the generated PNG */
  blob: Blob;
  /** Filename */
  filename: string;
  /** Actual print area dimensions in mm */
  printWidthMm: number;
  /** Actual print area dimensions in mm */
  printHeightMm: number;
}

/**
 * Generate a print-ready file with bleed and crop marks.
 * Returns a high-res PNG blob suitable for sublimation printing.
 */
export async function generatePrintFile(options: PrintFileOptions): Promise<PrintFileResult> {
  const { designImageSrc, dimensionLabel, overlayText, overlayFont, overlayAlign } = options;

  const { widthMm, heightMm } = parseDimensions(dimensionLabel);

  // Calculate pixel dimensions
  const printW = mmToPx(widthMm);
  const printH = mmToPx(heightMm);
  const bleedPx = mmToPx(BLEED_MM);
  const cropLen = mmToPx(CROP_MARK_LENGTH_MM);
  const cropOffset = mmToPx(CROP_MARK_OFFSET_MM);

  // Total canvas includes bleed on all sides + extra space for crop marks
  const marginPx = bleedPx + mmToPx(CROP_MARK_OFFSET_MM + CROP_MARK_LENGTH_MM);
  const canvasW = printW + 2 * bleedPx + 2 * (cropOffset + cropLen);
  const canvasH = printH + 2 * bleedPx + 2 * (cropOffset + cropLen);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Load design image
  const img = await loadImage(designImageSrc);

  // Draw design image covering print area + bleed (extended area)
  const designX = cropLen + cropOffset;
  const designY = cropLen + cropOffset;
  const designW = printW + 2 * bleedPx;
  const designH = printH + 2 * bleedPx;

  // Cover-fit the image
  drawImageCover(ctx, img, designX, designY, designW, designH);

  // Draw overlay text if present
  if (overlayText) {
    const fontSize = Math.round(printH * 0.08);
    ctx.font = `bold ${fontSize}px ${overlayFont || "sans-serif"}`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = Math.max(2, fontSize * 0.05);

    const textX = designX + bleedPx;
    const textY = designY + bleedPx + printH - fontSize * 0.5;
    const textAreaW = printW;

    ctx.textBaseline = "bottom";

    let x: number;
    if (overlayAlign === "left") {
      ctx.textAlign = "left";
      x = textX + fontSize * 0.3;
    } else if (overlayAlign === "right") {
      ctx.textAlign = "right";
      x = textX + textAreaW - fontSize * 0.3;
    } else {
      ctx.textAlign = "center";
      x = textX + textAreaW / 2;
    }

    ctx.strokeText(overlayText, x, textY);
    ctx.fillText(overlayText, x, textY);
  }

  // Draw crop marks
  drawCropMarks(ctx, {
    printX: designX + bleedPx,
    printY: designY + bleedPx,
    printW,
    printH,
    bleedPx,
    cropLen,
    cropOffset,
  });

  // Add metadata text
  ctx.fillStyle = "#666666";
  ctx.font = `${mmToPx(3)}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(
    `PADZONE | ${widthMm / 10}x${heightMm / 10}cm | 300 DPI | Bleed: 5mm`,
    cropLen,
    canvasH - mmToPx(4)
  );

  // Generate blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to generate blob"))),
      "image/png",
      1.0
    );
  });

  return {
    canvas,
    blob,
    filename: `PADZONE_print_${widthMm / 10}x${heightMm / 10}cm_300dpi.png`,
    printWidthMm: widthMm,
    printHeightMm: heightMm,
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

/** Draw image with cover-fit (fill entire area, crop excess) */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;

  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgRatio > targetRatio) {
    // Image is wider — crop sides
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    // Image is taller — crop top/bottom
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

interface CropMarkParams {
  printX: number;
  printY: number;
  printW: number;
  printH: number;
  bleedPx: number;
  cropLen: number;
  cropOffset: number;
}

/** Draw standard crop marks at all four corners */
function drawCropMarks(ctx: CanvasRenderingContext2D, p: CropMarkParams) {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(1, mmToPx(0.25));

  const corners = [
    { x: p.printX, y: p.printY }, // top-left
    { x: p.printX + p.printW, y: p.printY }, // top-right
    { x: p.printX, y: p.printY + p.printH }, // bottom-left
    { x: p.printX + p.printW, y: p.printY + p.printH }, // bottom-right
  ];

  for (const corner of corners) {
    const isLeft = corner.x === p.printX;
    const isTop = corner.y === p.printY;

    // Horizontal mark
    const hStart = isLeft
      ? corner.x - p.bleedPx - p.cropOffset - p.cropLen
      : corner.x + p.bleedPx + p.cropOffset;
    const hEnd = hStart + p.cropLen;

    ctx.beginPath();
    ctx.moveTo(hStart, corner.y);
    ctx.lineTo(hEnd, corner.y);
    ctx.stroke();

    // Vertical mark
    const vStart = isTop
      ? corner.y - p.bleedPx - p.cropOffset - p.cropLen
      : corner.y + p.bleedPx + p.cropOffset;
    const vEnd = vStart + p.cropLen;

    ctx.beginPath();
    ctx.moveTo(corner.x, vStart);
    ctx.lineTo(corner.x, vEnd);
    ctx.stroke();
  }
}
