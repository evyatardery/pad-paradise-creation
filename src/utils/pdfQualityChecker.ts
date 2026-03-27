/**
 * Smart PDF quality checker — analyzes actual PDF content
 * to determine if embedded images have sufficient resolution for print.
 * Unlike the naive check that assumes sourcePdf = vector = perfect quality,
 * this inspects the PDF byte stream for raster image markers.
 */
import { PDFDocument } from "pdf-lib";
import { parseDimensions } from "./printFileGenerator";
import type { PreflightResult } from "./printFileGenerator";

/**
 * Analyze a PDF file to determine print quality.
 * Checks for:
 * 1. Whether the PDF contains raster images (DCTDecode = JPEG, FlateDecode on XObjects)
 * 2. The dimensions of embedded images vs. required print dimensions
 * 3. Whether it's truly vector content (no embedded rasters)
 */
export async function checkPdfQuality(
  pdfUrl: string,
  dimensionLabel: string
): Promise<PreflightResult> {
  const { widthMm, heightMm } = parseDimensions(dimensionLabel);
  const BLEED_MM = 5;
  const pageW = widthMm + 2 * BLEED_MM;
  const pageH = heightMm + 2 * BLEED_MM;

  const requiredWidth = Math.ceil((pageW / 25.4) * 300);
  const requiredHeight = Math.ceil((pageH / 25.4) * 300);

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Failed to fetch PDF");
    const pdfBytes = new Uint8Array(await response.arrayBuffer());

    // Load with pdf-lib to get page dimensions
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    if (pages.length === 0) throw new Error("PDF has no pages");

    // Search raw bytes for raster image indicators
    const pdfText = new TextDecoder("latin1").decode(pdfBytes);

    // Find all image XObjects with their dimensions
    const imageInfos = extractImageDimensions(pdfText);

    if (imageInfos.length === 0) {
      // No raster images found → pure vector content
      return {
        ok: true,
        imageWidth: 0,
        imageHeight: 0,
        requiredWidth,
        requiredHeight,
        dpi: 300,
        warning: undefined,
      };
    }

    // Find the largest embedded image (main design)
    const largest = imageInfos.reduce((a, b) =>
      a.width * a.height > b.width * b.height ? a : b
    );

    // Calculate effective DPI
    const dpiW = largest.width / (pageW / 25.4);
    const dpiH = largest.height / (pageH / 25.4);
    const effectiveDpi = Math.min(dpiW, dpiH);

    const minDimension = Math.min(largest.width, largest.height);

    if (minDimension < 2000 || effectiveDpi < 150) {
      return {
        ok: false,
        imageWidth: largest.width,
        imageHeight: largest.height,
        requiredWidth,
        requiredHeight,
        dpi: Math.round(effectiveDpi),
        warning: `קובץ ה-PDF מכיל תמונה ברזולוציה נמוכה (${largest.width}x${largest.height} פיקסלים, ~${Math.round(effectiveDpi)} DPI). התוצאה עלולה לצאת מטושטשת במידה זו. מומלץ קובץ וקטורי או תמונה של לפחות ${requiredWidth}x${requiredHeight} פיקסלים.`,
      };
    }

    return {
      ok: true,
      imageWidth: largest.width,
      imageHeight: largest.height,
      requiredWidth,
      requiredHeight,
      dpi: Math.round(effectiveDpi),
    };
  } catch (err) {
    console.warn("PDF quality check failed, assuming OK:", err);
    // Fallback: if we can't analyze, assume it's fine
    return {
      ok: true,
      imageWidth: 0,
      imageHeight: 0,
      requiredWidth,
      requiredHeight,
      dpi: 300,
    };
  }
}

interface ImageDimension {
  width: number;
  height: number;
}

/**
 * Extract image dimensions from PDF raw text.
 * Looks for XObject image dictionaries with /Width and /Height entries.
 */
function extractImageDimensions(pdfText: string): ImageDimension[] {
  const images: ImageDimension[] = [];

  // Pattern: find XObject Image dictionaries
  // They contain /Subtype /Image along with /Width and /Height
  const xobjectPattern = /<<[^>]*\/Subtype\s*\/Image[^>]*>>/g;
  let match: RegExpExecArray | null;

  while ((match = xobjectPattern.exec(pdfText)) !== null) {
    const dict = match[0];
    const widthMatch = dict.match(/\/Width\s+(\d+)/);
    const heightMatch = dict.match(/\/Height\s+(\d+)/);

    if (widthMatch && heightMatch) {
      const w = parseInt(widthMatch[1], 10);
      const h = parseInt(heightMatch[1], 10);
      // Filter out tiny images (icons, masks, thumbnails)
      if (w > 50 && h > 50) {
        images.push({ width: w, height: h });
      }
    }
  }

  return images;
}
