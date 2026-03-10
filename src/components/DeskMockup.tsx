import React from "react";
import deskScene from "@/assets/mockup-desk-scene.jpg";
import keyboardImg from "@/assets/keyboard-overlay.png";
import mouseImg from "@/assets/mouse-overlay.png";

/**
 * Real-world dimensions (cm):
 *   Desk visible area ≈ 100 cm wide
 *   Full-size keyboard ≈ 45 cm wide, ~15 cm deep
 *   Gaming mouse ≈ 7 cm wide, ~12 cm long
 *
 * Pad sizes:
 *   XXL 90×40 → 90% of desk width
 *   XL  80×40 → 80% of desk width
 *   L   45×40 → 45% of desk width (≈ keyboard width)
 *
 * All percentages are relative to a 100cm desk viewport.
 */

const DESK_WIDTH_CM = 100;
const KEYBOARD_WIDTH_CM = 45;
const KEYBOARD_DEPTH_CM = 15;
const MOUSE_WIDTH_CM = 7;
const MOUSE_DEPTH_CM = 12;

interface PadSpec {
  widthCm: number;
  depthCm: number;
}

const PAD_SPECS: Record<string, PadSpec> = {
  "90x40": { widthCm: 90, depthCm: 40 },
  "80x40": { widthCm: 80, depthCm: 40 },
  "45x40": { widthCm: 45, depthCm: 40 },
};

function parseSizeKey(sizeLabel: string): string {
  const match = sizeLabel.match(/(\d+x\d+)/);
  return match ? match[1] : "80x40";
}

// Convert cm to percentage of desk width
const cmToPct = (cm: number) => (cm / DESK_WIDTH_CM) * 100;

// The scene aspect ratio (16:9). Desk depth visible ≈ 56.25% of width in px.
// We express vertical positions as % of container height.
// Container height in "cm" terms ≈ 100 * (9/16) = 56.25 cm
const DESK_DEPTH_CM = DESK_WIDTH_CM * (9 / 16);
const cmToVertPct = (cm: number) => (cm / DESK_DEPTH_CM) * 100;

interface Props {
  designImage: string;
  designTitle: string;
  sizeLabel?: string;
  overlayText?: string;
  overlayFont?: string;
  overlayAlign?: "left" | "center" | "right";
}

const DeskMockup = ({
  designImage,
  designTitle,
  sizeLabel = "XL 80x40",
  overlayText,
  overlayFont,
  overlayAlign = "center",
}: Props) => {
  const sizeKey = parseSizeKey(sizeLabel);
  const pad = PAD_SPECS[sizeKey] ?? PAD_SPECS["80x40"];

  // Pad dimensions as % of container
  const padW = cmToPct(pad.widthCm);
  const padH = cmToVertPct(pad.depthCm);
  const padLeft = (100 - padW) / 2;
  // Place pad so its bottom edge is near 92% of scene height
  const padTop = Math.max(92 - padH, 25);

  // Keyboard: centered on pad, sitting on top of pad's upper area
  const kbW = cmToPct(KEYBOARD_WIDTH_CM);
  const kbH = cmToVertPct(KEYBOARD_DEPTH_CM);
  const kbLeft = (100 - kbW) / 2;
  // Keyboard sits in the upper-middle portion of the pad
  const kbTop = padTop + padH * 0.08;

  // Mouse: to the right of the keyboard, vertically centered with keyboard
  const mouseW = cmToPct(MOUSE_WIDTH_CM);
  const mouseH = cmToVertPct(MOUSE_DEPTH_CM);
  const mouseLeft = kbLeft + kbW + cmToPct(3); // 3cm gap
  const mouseTop = kbTop + (kbH - mouseH) / 2;

  const textAlignStyle: Record<string, React.CSSProperties> = {
    left: { textAlign: "left", left: "8%", right: "auto", transform: "none" },
    center: { textAlign: "center", left: "50%", right: "auto", transform: "translateX(-50%)" },
    right: { textAlign: "right", right: "8%", left: "auto", transform: "none" },
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/50">
      {/* Layer 0: Desk scene with monitors */}
      <img
        src={deskScene}
        alt="Gaming desk setup"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 1: Pad shadow (slightly offset, blurred) */}
      <div
        className="absolute rounded-sm"
        style={{
          top: `${padTop + 0.8}%`,
          left: `${padLeft + 0.3}%`,
          width: `${padW}%`,
          height: `${padH}%`,
          background: "rgba(0,0,0,0.45)",
          filter: "blur(12px)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Layer 2: The mousepad with design */}
      <div
        className="absolute rounded-sm overflow-hidden"
        style={{
          top: `${padTop}%`,
          left: `${padLeft}%`,
          width: `${padW}%`,
          height: `${padH}%`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover"
        />

        {/* Subtle pad edge highlight */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />

        {/* Text overlay on the pad */}
        {overlayText && (
          <div
            className="absolute bottom-[10%] font-bold px-3 py-1 rounded-md"
            style={{
              fontSize: "clamp(0.5rem, 2vw, 1.2rem)",
              fontFamily: overlayFont || "inherit",
              color: "hsl(var(--primary))",
              backgroundColor: "rgba(0,0,0,0.6)",
              textShadow: "0 0 8px hsl(var(--primary) / 0.6)",
              maxWidth: "90%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...textAlignStyle[overlayAlign],
            }}
          >
            {overlayText}
          </div>
        )}
      </div>

      {/* Layer 3: Keyboard shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${kbTop + 1.5}%`,
          left: `${kbLeft + 0.3}%`,
          width: `${kbW}%`,
          height: `${kbH}%`,
          background: "rgba(0,0,0,0.35)",
          filter: "blur(8px)",
          borderRadius: "4px",
        }}
      />

      {/* Layer 4: Keyboard */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${kbTop}%`,
          left: `${kbLeft}%`,
          width: `${kbW}%`,
          height: `${kbH}%`,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <img
          src={keyboardImg}
          alt="Gaming keyboard"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Layer 5: Mouse shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${mouseTop + 1.5}%`,
          left: `${mouseLeft + 0.3}%`,
          width: `${mouseW}%`,
          height: `${mouseH}%`,
          background: "rgba(0,0,0,0.3)",
          filter: "blur(6px)",
          borderRadius: "50%",
        }}
      />

      {/* Layer 6: Mouse */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${mouseTop}%`,
          left: `${mouseLeft}%`,
          width: `${mouseW}%`,
          height: `${mouseH}%`,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <img
          src={mouseImg}
          alt="Gaming mouse"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Size badge */}
      <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/30">
        {sizeKey} cm
      </div>
    </div>
  );
};

export default DeskMockup;
