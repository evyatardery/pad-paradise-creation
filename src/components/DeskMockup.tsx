import React from "react";
import deskScene from "@/assets/mockup-desk-scene.jpg";
import keyboardImg from "@/assets/keyboard-overlay.png";
import mouseImg from "@/assets/mouse-overlay.png";

/**
 * Cinematic 3/4 perspective desk mockup.
 * Accessories use real-world CM proportions relative to a 100cm desk.
 * Pad uses SCALE factor for visual breathing room.
 */

const DESK_W_CM = 100;
const DESK_H_CM = DESK_W_CM * (9 / 16); // ~56.25cm
const SCALE = 0.55;

const cmToW = (cm: number) => (cm / DESK_W_CM) * 100;
const cmToH = (cm: number) => (cm / DESK_H_CM) * 100;

interface PadSpec {
  widthPct: number;
  depthPct: number;
}

const PAD_SPECS: Record<string, PadSpec> = {
  "90x40": { widthPct: 90 * SCALE, depthPct: cmToH(40) * SCALE },
  "80x40": { widthPct: 80 * SCALE, depthPct: cmToH(40) * SCALE },
  "45x40": { widthPct: 45 * SCALE, depthPct: cmToH(40) * SCALE },
};

// Real-world accessory sizes → percentage of container (NOT scaled by SCALE)
const KB_W = cmToW(44);   // ~44%
const KB_H = cmToH(15);   // ~26.7%
const MOUSE_W = cmToW(6.5);
const MOUSE_H = cmToH(11);

function parseSizeKey(sizeLabel: string): string {
  const match = sizeLabel.match(/(\d+x\d+)/);
  return match ? match[1] : "80x40";
}

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

  const padW = pad.widthPct;
  const padH = pad.depthPct;
  const padLeft = (100 - padW) / 2;
  // Center pad vertically in the lower 60% of scene
  const padTop = 52 - padH / 2;

  // Keyboard centered horizontally, upper portion of pad
  const kbLeft = (100 - KB_W) / 2;
  const kbTop = padTop + padH * 0.05;

  // Mouse to the right of keyboard
  const mouseLeft = kbLeft + KB_W + 2;
  const mouseTop = kbTop + (KB_H - MOUSE_H) / 2;

  const PAD_THICKNESS = 3; // px for 3-4mm edge

  const textAlignStyle: Record<string, React.CSSProperties> = {
    left: { textAlign: "left", left: "8%", right: "auto", transform: "none" },
    center: { textAlign: "center", left: "50%", right: "auto", transform: "translateX(-50%)" },
    right: { textAlign: "right", right: "8%", left: "auto", transform: "none" },
  };

  return (
    <div
      className="relative w-full rounded-xl border border-border/50"
      style={{
        aspectRatio: "16 / 9",
        overflow: "hidden",
      }}
    >
      {/* Background desk scene — full bleed, no transform */}
      <img
        src={deskScene}
        alt="Gaming desk setup"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.85)" }}
      />

      {/* Ambient vignette for cinematic feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* All desk items share this perspective container */}
      <div
        className="absolute"
        style={{
          top: "5%",
          left: "5%",
          width: "90%",
          height: "90%",
          perspective: "600px",
          perspectiveOrigin: "50% 25%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(35deg) rotateZ(-4deg)",
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
        >
        {/* Pad diagonal shadow */}
        <div
          className="absolute rounded-md"
          style={{
            top: `${padTop + 2.5}%`,
            left: `${padLeft + 1}%`,
            width: `${padW}%`,
            height: `${padH}%`,
            background: "rgba(0,0,0,0.5)",
            filter: "blur(18px)",
            transform: "skewX(-2deg)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Pad thickness / 3D edge (bottom face) */}
        <div
          className="absolute rounded-b-md"
          style={{
            top: `calc(${padTop + padH}% - 1px)`,
            left: `${padLeft + 0.15}%`,
            width: `${padW}%`,
            height: `${PAD_THICKNESS}px`,
            background: "linear-gradient(to bottom, #1a1a1a, #0d0d0d)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Pad right edge for 3D depth */}
        <div
          className="absolute"
          style={{
            top: `${padTop + 0.3}%`,
            left: `calc(${padLeft + padW}% - 1px)`,
            width: `${PAD_THICKNESS - 1}px`,
            height: `${padH}%`,
            background: "linear-gradient(to right, #1a1a1a, #111)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* The mousepad surface */}
        <div
          className="absolute rounded-md overflow-hidden"
          style={{
            top: `${padTop}%`,
            left: `${padLeft}%`,
            width: `${padW}%`,
            height: `${padH}%`,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={designImage}
            alt={designTitle}
            className="w-full h-full object-cover"
          />

          {/* Surface glare for realism */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
            }}
          />

          {/* Text overlay */}
          {overlayText && (
            <div
              className="absolute bottom-[10%] font-bold px-3 py-1 rounded-md"
              style={{
                fontSize: "clamp(0.5rem, 1.5vw, 1rem)",
                fontFamily: overlayFont || "inherit",
                color: "hsl(var(--primary))",
                backgroundColor: "rgba(0,0,0,0.65)",
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

        {/* Keyboard shadow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${kbTop + 2}%`,
            left: `${kbLeft + 0.5}%`,
            width: `${KB_W}%`,
            height: `${KB_H}%`,
            background: "rgba(0,0,0,0.4)",
            filter: "blur(10px)",
            borderRadius: "6px",
            transform: "skewX(-1deg)",
          }}
        />

        {/* Keyboard */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${kbTop}%`,
            left: `${kbLeft}%`,
            width: `${KB_W}%`,
            height: `${KB_H}%`,
            transform: "rotate(-3deg)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={keyboardImg}
            alt="Gaming keyboard"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
          />
        </div>

        {/* Mouse shadow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${mouseTop + 2}%`,
            left: `${mouseLeft + 0.5}%`,
            width: `${MOUSE_W}%`,
            height: `${MOUSE_H}%`,
            background: "rgba(0,0,0,0.35)",
            filter: "blur(8px)",
            borderRadius: "50%",
          }}
        />

        {/* Mouse */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${mouseTop}%`,
            left: `${mouseLeft}%`,
            width: `${MOUSE_W}%`,
            height: `${MOUSE_H}%`,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={mouseImg}
            alt="Gaming mouse"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.5))" }}
          />
        </div>
        </div>
      </div>

      {/* Size badge (outside 3D layer) */}
      <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/30">
        {sizeKey} cm
      </div>
    </div>
  );
};

export default DeskMockup;
