import React from "react";
import mockupDeskBg from "@/assets/mockup-desk-bg.jpg";
import mockupOverlay from "@/assets/mockup-overlay.png";

/**
 * Pad real-world dimensions (cm) mapped to proportional widths
 * inside the mockup viewport. A standard full-size keyboard is ~44 cm wide,
 * so we use that as the reference for realistic proportions.
 *
 * The mockup viewport represents roughly 100 cm of desk width.
 * keyboard ≈ 44 cm → ~44% of viewport
 * 90×40 pad → 90% viewport width  (wider than keyboard)
 * 80×40 pad → 80% viewport width
 * 45×40 pad → 45% viewport width
 *
 * Height is derived from the aspect ratio of each pad size.
 */

const PAD_PROPORTIONS: Record<string, { widthPct: number; aspectRatio: number }> = {
  "90x40": { widthPct: 92, aspectRatio: 90 / 40 },
  "80x40": { widthPct: 82, aspectRatio: 80 / 40 },
  "45x40": { widthPct: 50, aspectRatio: 45 / 40 },
};

function parseSizeKey(sizeLabel: string): string {
  // Extract "90x40" from "XXL 90x40" etc.
  const match = sizeLabel.match(/(\d+x\d+)/);
  return match ? match[1] : "80x40";
}

interface Props {
  designImage: string;
  designTitle: string;
  /** Size label like "XXL 90x40" */
  sizeLabel?: string;
  /** Optional text overlay on the pad */
  overlayText?: string;
  /** Font family for overlay text */
  overlayFont?: string;
  /** Text alignment */
  overlayAlign?: "left" | "center" | "right";
}


const DeskMockup = forwardRef<HTMLDivElement, Props>(({
  designImage,
  designTitle,
  sizeLabel = "XL 80x40",
  overlayText,
  overlayFont,
  overlayAlign = "center",
}, ref) => {
  const sizeKey = parseSizeKey(sizeLabel);
  const { widthPct, aspectRatio } = PAD_PROPORTIONS[sizeKey] ?? PAD_PROPORTIONS["80x40"];

  // Pad height as percentage of viewport width (since the container is aspect-video 16:9)
  // We express height relative to the container height.
  // Container aspect = 16:9, so containerH = containerW * 9/16
  // padW = containerW * widthPct/100
  // padH = padW / aspectRatio
  // padH as % of containerH = (padW / aspectRatio) / containerH * 100
  //   = (containerW * widthPct/100 / aspectRatio) / (containerW * 9/16) * 100
  //   = (widthPct / aspectRatio) / (9/16) * 100 / 100
  //   = widthPct * 16 / (aspectRatio * 9)
  const heightPct = (widthPct * 16) / (aspectRatio * 9);

  // Center the pad horizontally, place it in the lower portion of the desk
  const padLeft = (100 - widthPct) / 2;
  const padTop = Math.max(95 - heightPct, 30); // sit near the bottom, min 30%

  const textAlignStyle: Record<string, React.CSSProperties> = {
    left: { textAlign: "left", left: "8%", right: "auto", transform: "none" },
    center: { textAlign: "center", left: "50%", right: "auto", transform: "translateX(-50%)" },
    right: { textAlign: "right", right: "8%", left: "auto", transform: "none" },
  };

  return (
    <div ref={ref} className="relative w-full aspect-video rounded-xl overflow-hidden neon-box">
      {/* Layer 1: Desk surface background */}
      <img
        src={mockupDeskBg}
        alt="Gaming desk"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: The mousepad (dynamically sized) */}
      <div
        className="absolute"
        style={{
          top: `${padTop}%`,
          left: `${padLeft}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.55))",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover rounded-sm"
        />

        {/* Text overlay on the pad */}
        {overlayText && (
          <div
            className="absolute bottom-[10%] text-primary font-bold neon-text px-3 py-1 rounded-md"
            style={{
              fontSize: "clamp(0.6rem, 2.5vw, 1.4rem)",
              fontFamily: overlayFont || "inherit",
              backgroundColor: "rgba(0,0,0,0.5)",
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

      {/* Layer 3: Keyboard + Mouse + Headphones (transparent overlay) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "10%",
          width: "80%",
          height: "80%",
        }}
      >
        <img
          src={mockupOverlay}
          alt=""
          className="w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
          }}
        />
      </div>

      {/* Size indicator badge */}
      <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/30">
        {sizeKey} cm
      </div>
    </div>
  );
});

DeskMockup.displayName = "DeskMockup";

export default DeskMockup;
