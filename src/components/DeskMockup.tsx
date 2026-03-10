import React from "react";
import deskScene from "@/assets/mockup-desk-scene.jpg";
import keyboardImg from "@/assets/keyboard-overlay.png";
import mouseImg from "@/assets/mouse-overlay.png";

/**
 * Cinematic top-down desk mockup with monitor, keyboard, mouse.
 * Mouse sits ON the pad (lower-right). Keyboard on the pad (upper area).
 * Monitor visible in background (baked into desk scene image).
 */

const DESK_W_CM = 140;
const DESK_H_CM = 90;

const cmToW = (cm: number) => (cm / DESK_W_CM) * 100;
const cmToH = (cm: number) => (cm / DESK_H_CM) * 100;

interface PadSpec {
  widthPct: number;
  depthPct: number;
}

const PAD_SPECS: Record<string, PadSpec> = {
  "80x30": { widthPct: cmToW(80), depthPct: cmToH(30) },
  "60x30": { widthPct: cmToW(60), depthPct: cmToH(30) },
  "22.5x18.5": { widthPct: cmToW(22.5), depthPct: cmToH(18.5) },
};

const KB_W = cmToW(30);
const KB_H = cmToH(12);
const MOUSE_W = cmToW(7);
const MOUSE_H = cmToH(12);

function parseSizeKey(sizeLabel: string): string {
  const match = sizeLabel.match(/([\d.]+x[\d.]+)/);
  return match ? match[1] : "60x30";
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
  sizeLabel = "L 60x30",
  overlayText,
  overlayFont,
  overlayAlign = "center",
}: Props) => {
  const sizeKey = parseSizeKey(sizeLabel);
  const pad = PAD_SPECS[sizeKey] ?? PAD_SPECS["60x30"];

  const padW = pad.widthPct;
  const padH = pad.depthPct;
  const padLeft = (100 - padW) / 2;
  const padTop = 48 - padH / 2;

  // Keyboard: centered on pad, upper portion
  const kbLeft = padLeft + (padW - KB_W) / 2 - 4;
  const kbTop = padTop + padH * 0.08;

  // Mouse: on the pad, lower-right area
  const mouseLeft = padLeft + padW * 0.72;
  const mouseTop = padTop + padH * 0.45;

  const textAlignStyle: Record<string, React.CSSProperties> = {
    left: { textAlign: "left", left: "8%", right: "auto", transform: "none" },
    center: { textAlign: "center", left: "50%", right: "auto", transform: "translateX(-50%)" },
    right: { textAlign: "right", right: "8%", left: "auto", transform: "none" },
  };

  return (
    <div
      className="relative w-full rounded-xl border border-border/50"
      style={{ aspectRatio: "140 / 90", overflow: "hidden" }}
    >
      {/* Background desk scene with monitor */}
      <img
        src={deskScene}
        alt="Gaming desk setup"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(1.15)" }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* ── Pad shadow (desk surface) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${padTop + 3}%`,
          left: `${padLeft + 1.5}%`,
          width: `${padW}%`,
          height: `${padH}%`,
          background: "rgba(0,0,0,0.5)",
          filter: "blur(22px)",
          borderRadius: "8px",
          transform: "scale(1.03)",
          transformOrigin: "50% 100%",
        }}
      />

      {/* ── Mousepad surface ── */}
      <div
        className="absolute"
        style={{
          top: `${padTop}%`,
          left: `${padLeft}%`,
          width: `${padW}%`,
          height: `${padH}%`,
        }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 overflow-hidden rounded-lg"
            style={{
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <img
              src={designImage}
              alt={designTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Surface glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.03) 100%)",
              }}
            />

            {/* Text overlay */}
            {overlayText && (
              <div
                className="absolute bottom-[14%] font-bold px-3 py-1 rounded-md"
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

          {/* Pad bottom edge */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "3px",
              background: "linear-gradient(to bottom, rgba(80,80,80,0.6), rgba(30,30,30,0.9))",
              borderRadius: "0 0 8px 8px",
              transform: "translateY(3px)",
            }}
          />
        </div>
      </div>

      {/* ── Keyboard shadow (on pad) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${kbTop + 2.5}%`,
          left: `${kbLeft + 0.8}%`,
          width: `${KB_W}%`,
          height: `${KB_H}%`,
          background: "rgba(0,0,0,0.45)",
          filter: "blur(12px)",
          borderRadius: "6px",
        }}
      />

      {/* ── Keyboard ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${kbTop}%`,
          left: `${kbLeft}%`,
          width: `${KB_W}%`,
          height: `${KB_H}%`,
        }}
      >
        <img
          src={keyboardImg}
          alt="RGB mechanical keyboard"
          className="w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }}
        />
      </div>

      {/* ── Mouse shadow (on pad) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${mouseTop + 2}%`,
          left: `${mouseLeft + 0.5}%`,
          width: `${MOUSE_W}%`,
          height: `${MOUSE_H}%`,
          background: "rgba(0,0,0,0.4)",
          filter: "blur(10px)",
          borderRadius: "50%",
        }}
      />

      {/* ── Mouse ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${mouseTop}%`,
          left: `${mouseLeft}%`,
          width: `${MOUSE_W}%`,
          height: `${MOUSE_H}%`,
        }}
      >
        <img
          src={mouseImg}
          alt="Gaming mouse"
          className="w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.6))" }}
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
