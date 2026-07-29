#!/usr/bin/env node
// Automatic resolution check for catalog assets.
// Usage:
//   node scripts/check-catalog-assets.mjs            -> check every image in src/assets/pads
//   node scripts/check-catalog-assets.mjs file1 ...  -> check specific files before adding them
//
// Exits with code 1 if any checked image is too small for catalog display.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const PADS_DIR = "src/assets/pads";

// Minimum resolution required for the catalog grid / mockup preview
const DISPLAY_MIN = { w: 1920, h: 1080 };
// Print minimums at 300 DPI + 5mm bleed (M 22.5x18.5, L 60x30, XL 80x30)
const PRINT_MIN = {
  M: { w: 2775, h: 2303 },
  L: { w: 7205, h: 3661 },
  XL: { w: 9567, h: 3661 },
};

function dimensionsPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function dimensionsJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function dimensionsWebp(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const fmt = buf.toString("ascii", 12, 16);
  if (fmt === "VP8X") return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
  if (fmt === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  if (fmt === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function imageSize(file) {
  const buf = readFileSync(file);
  const ext = extname(file).toLowerCase();
  if (ext === ".png") return dimensionsPng(buf);
  if (ext === ".jpg" || ext === ".jpeg") return dimensionsJpeg(buf);
  if (ext === ".webp") return dimensionsWebp(buf);
  return null;
}

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const args = process.argv.slice(2);
const files = args.length
  ? args
  : readdirSync(PADS_DIR)
      .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
      .map((f) => join(PADS_DIR, f))
      .sort();

const tooSmall = [];
const notPrintReady = [];
const unreadable = [];

for (const file of files) {
  if (!statSync(file).isFile()) continue;
  const size = imageSize(file);
  if (!size) { unreadable.push(file); continue; }
  if (size.w < DISPLAY_MIN.w || size.h < DISPLAY_MIN.h) {
    tooSmall.push({ file, size });
  } else {
    const fits = Object.entries(PRINT_MIN)
      .filter(([, m]) => size.w >= m.w && size.h >= m.h)
      .map(([k]) => k);
    if (fits.length < 3) notPrintReady.push({ file, size, fits });
  }
}

const label = (f) => basename(f);

console.log(`Checked ${files.length} catalog asset(s) against display minimum ${DISPLAY_MIN.w}x${DISPLAY_MIN.h}\n`);

if (tooSmall.length) {
  console.log("❌ Too small for catalog display — do not add:");
  for (const { file, size } of tooSmall) {
    console.log(`   ${label(file)} — ${size.w}x${size.h} (needs at least ${DISPLAY_MIN.w}x${DISPLAY_MIN.h})`);
  }
  console.log("");
}

if (notPrintReady.length) {
  console.log("⚠️  Display-OK but below print minimums (300 DPI + 5mm bleed):");
  for (const { file, size, fits } of notPrintReady) {
    console.log(`   ${label(file)} — ${size.w}x${size.h} — print-ready for: ${fits.length ? fits.join(", ") : "none"}`);
  }
  console.log("");
}

if (unreadable.length) {
  console.log("ℹ️  Could not read dimensions (unsupported format):");
  unreadable.forEach((f) => console.log(`   ${label(f)}`));
  console.log("");
}

if (!tooSmall.length) console.log("✅ All checked assets meet the catalog display minimum.");

process.exit(tooSmall.length ? 1 : 0);
