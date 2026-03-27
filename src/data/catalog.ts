// Vector-based designs only (with PDF source for high-quality print)

// Abstract
import abstractPattern from "@/assets/pads/abstract-pattern.jpg";
import abstractPatternPdf from "@/assets/pads/abstract-pattern.pdf?url";
import abstractDots from "@/assets/pads/abstract-dots.jpg";
import abstractDotsPdf from "@/assets/pads/abstract-dots.pdf?url";
import abstractHalftoneSwirl from "@/assets/pads/abstract-halftone-swirl.jpg";
import abstractHalftoneSwirlPdf from "@/assets/pads/abstract-halftone-swirl.pdf?url";
import abstractHalftoneWave from "@/assets/pads/abstract-halftone-wave.jpg";
import abstractHalftoneWavePdf from "@/assets/pads/abstract-halftone-wave.pdf?url";
import abstractDarkLiquid from "@/assets/pads/abstract-dark-liquid.jpg";
import abstractDarkLiquidPdf from "@/assets/pads/abstract-dark-liquid.pdf?url";

// Cyber
import cyberRedBlaze from "@/assets/pads/cyber-red-blaze.jpg";
import cyberRedBlazePdf from "@/assets/pads/cyber-red-blaze.pdf?url";
import cyberNeonLines from "@/assets/pads/cyber-neon-lines.jpg";
import cyberNeonLinesPdf from "@/assets/pads/cyber-neon-lines.pdf?url";
import cyberHexRainbow from "@/assets/pads/cyber-hex-rainbow.jpg";
import cyberHexRainbowPdf from "@/assets/pads/cyber-hex-rainbow.pdf?url";
import cyberHexNeon from "@/assets/pads/cyber-hex-neon.jpg";
import cyberHexNeonPdf from "@/assets/pads/cyber-hex-neon.pdf?url";
import cyberLightTrails from "@/assets/pads/cyber-light-trails.jpg";
import cyberLightTrailsPdf from "@/assets/pads/cyber-light-trails.pdf?url";
import cyberSpeedometer from "@/assets/pads/cyber-speedometer.jpg";
import cyberSpeedometerPdf from "@/assets/pads/cyber-speedometer.pdf?url";
import cyberNeonDoors from "@/assets/pads/cyber-neon-doors.jpg";
import cyberNeonDoorsPdf from "@/assets/pads/cyber-neon-doors.pdf?url";

// Colorful
import colorfulTealFigure from "@/assets/pads/colorful-teal-figure.jpg";
import colorfulTealFigurePdf from "@/assets/pads/colorful-teal-figure.pdf?url";
import colorfulPixelEye from "@/assets/pads/colorful-pixel-eye.jpg";
import colorfulPixelEyePdf from "@/assets/pads/colorful-pixel-eye.pdf?url";

// Dark
import darkInkBrush from "@/assets/pads/dark-ink-brush.jpg";
import darkInkBrushPdf from "@/assets/pads/dark-ink-brush.pdf?url";
import darkHalloween from "@/assets/pads/dark-halloween.jpg";
import darkHalloweenPdf from "@/assets/pads/dark-halloween.pdf?url";
import darkHauntedForest from "@/assets/pads/dark-haunted-forest.jpg";
import darkHauntedForestPdf from "@/assets/pads/dark-haunted-forest.pdf?url";
import darkMoonlitTree from "@/assets/pads/dark-moonlit-tree.jpg";
import darkMoonlitTreePdf from "@/assets/pads/dark-moonlit-tree.pdf?url";
import darkHexGold from "@/assets/pads/dark-hex-gold.jpg";
import darkHexGoldPdf from "@/assets/pads/dark-hex-gold.pdf?url";
import darkRedFrame from "@/assets/pads/dark-red-frame.jpg";
import darkRedFramePdf from "@/assets/pads/dark-red-frame.pdf?url";

// Gaming
import gameAstroGamer from "@/assets/pads/game-astro-gamer.jpg";
import gameAstroGamerPdf from "@/assets/pads/game-astro-gamer.pdf?url";
import gamePsNeonIcons from "@/assets/pads/game-ps-neon-icons.jpg";
import gamePsNeonIconsPdf from "@/assets/pads/game-ps-neon-icons.pdf?url";
import gameGamerText from "@/assets/pads/game-gamer-text.jpg";
import gameGamerTextPdf from "@/assets/pads/game-gamer-text.pdf?url";
import gameNeonSupercar from "@/assets/pads/game-neon-supercar.jpg";
import gameNeonSupercarPdf from "@/assets/pads/game-neon-supercar.pdf?url";
import gameFlameWheel from "@/assets/pads/game-flame-wheel.jpg";
import gameFlameWheelPdf from "@/assets/pads/game-flame-wheel.pdf?url";

// Anime
import animeCosmicGirl from "@/assets/pads/anime-cosmic-girl.jpg";
import animeCosmicGirlPdf from "@/assets/pads/anime-cosmic-girl.pdf?url";

// Sport
import sportMessiArgentina from "@/assets/pads/sport-messi-argentina.jpg";
import sportMessiArgentinaPdf from "@/assets/pads/sport-messi-argentina.pdf?url";

export interface PadDesign {
  id: string;
  title: string;
  image: string;
  category: string;
  /** Path to original vector PDF for high-quality print output */
  sourcePdf?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  coverImage: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "cyber",
    title: "סייבר וטכנולוגיה",
    icon: "🔮",
    coverImage: cyberRedBlaze,
    description: "מנהרות דיגיטליות וגרידים עתידניים"
  },
  {
    id: "abstract",
    title: "מופשט",
    icon: "🌀",
    coverImage: abstractPattern,
    description: "צורות אורגניות ודפוסים ייחודיים"
  },
  {
    id: "colorful",
    title: "צבעוני",
    icon: "🎨",
    coverImage: colorfulTealFigure,
    description: "עיצובים צבעוניים ומלאי חיים"
  },
  {
    id: "dark",
    title: "כהה ומינימלי",
    icon: "🖤",
    coverImage: darkHexGold,
    description: "עיצובים כהים ואלגנטיים"
  },
  {
    id: "gaming",
    title: "גיימינג",
    icon: "🎮",
    coverImage: gameAstroGamer,
    description: "פדים בסגנון גיימינג קלאסי"
  },
  {
    id: "anime",
    title: "אנימה",
    icon: "⚔️",
    coverImage: animeCosmicGirl,
    description: "עיצובים בסגנון אנימה ומנגה"
  },
  {
    id: "sport",
    title: "ספורט",
    icon: "⚽",
    coverImage: sportMessiArgentina,
    description: "עיצובי ספורט וכדורגל"
  },
];

export const padDesigns: PadDesign[] = [
  // Cyber
  { id: "cyber-1", title: "Red Blaze", image: cyberRedBlaze, category: "cyber", sourcePdf: cyberRedBlazePdf },
  { id: "cyber-2", title: "Neon Lines", image: cyberNeonLines, category: "cyber", sourcePdf: cyberNeonLinesPdf },
  { id: "cyber-3", title: "Hex Rainbow", image: cyberHexRainbow, category: "cyber", sourcePdf: cyberHexRainbowPdf },
  { id: "cyber-4", title: "Hex Neon Grid", image: cyberHexNeon, category: "cyber", sourcePdf: cyberHexNeonPdf },
  { id: "cyber-5", title: "Light Trails", image: cyberLightTrails, category: "cyber", sourcePdf: cyberLightTrailsPdf },
  { id: "cyber-6", title: "Speedometer", image: cyberSpeedometer, category: "cyber", sourcePdf: cyberSpeedometerPdf },
  { id: "cyber-7", title: "Neon Doors", image: cyberNeonDoors, category: "cyber", sourcePdf: cyberNeonDoorsPdf },

  // Abstract
  { id: "abs-1", title: "Organic Pattern", image: abstractPattern, category: "abstract", sourcePdf: abstractPatternPdf },
  { id: "abs-2", title: "Abstract Dots", image: abstractDots, category: "abstract", sourcePdf: abstractDotsPdf },
  { id: "abs-3", title: "Halftone Swirl", image: abstractHalftoneSwirl, category: "abstract", sourcePdf: abstractHalftoneSwirlPdf },
  { id: "abs-4", title: "Halftone Wave", image: abstractHalftoneWave, category: "abstract", sourcePdf: abstractHalftoneWavePdf },
  { id: "abs-5", title: "Dark Liquid", image: abstractDarkLiquid, category: "abstract", sourcePdf: abstractDarkLiquidPdf },

  // Colorful
  { id: "col-1", title: "Teal Figure", image: colorfulTealFigure, category: "colorful", sourcePdf: colorfulTealFigurePdf },
  { id: "col-2", title: "Pixel Eye", image: colorfulPixelEye, category: "colorful", sourcePdf: colorfulPixelEyePdf },

  // Dark
  { id: "dark-1", title: "Ink Brush", image: darkInkBrush, category: "dark", sourcePdf: darkInkBrushPdf },
  { id: "dark-2", title: "Halloween Night", image: darkHalloween, category: "dark", sourcePdf: darkHalloweenPdf },
  { id: "dark-3", title: "Haunted Forest", image: darkHauntedForest, category: "dark", sourcePdf: darkHauntedForestPdf },
  { id: "dark-4", title: "Moonlit Tree", image: darkMoonlitTree, category: "dark", sourcePdf: darkMoonlitTreePdf },
  { id: "dark-5", title: "Hex Gold", image: darkHexGold, category: "dark", sourcePdf: darkHexGoldPdf },
  { id: "dark-6", title: "Red Frame", image: darkRedFrame, category: "dark", sourcePdf: darkRedFramePdf },

  // Gaming
  { id: "game-1", title: "Astro Gamer", image: gameAstroGamer, category: "gaming", sourcePdf: gameAstroGamerPdf },
  { id: "game-2", title: "PS Neon Icons", image: gamePsNeonIcons, category: "gaming", sourcePdf: gamePsNeonIconsPdf },
  { id: "game-3", title: "Gamer Text", image: gameGamerText, category: "gaming", sourcePdf: gameGamerTextPdf },
  { id: "game-4", title: "Neon Supercar", image: gameNeonSupercar, category: "gaming", sourcePdf: gameNeonSupercarPdf },
  { id: "game-5", title: "Flame Wheel", image: gameFlameWheel, category: "gaming", sourcePdf: gameFlameWheelPdf },

  // Anime
  { id: "anime-1", title: "Cosmic Girl", image: animeCosmicGirl, category: "anime", sourcePdf: animeCosmicGirlPdf },

  // Sport
  { id: "sport-1", title: "Messi Argentina", image: sportMessiArgentina, category: "sport", sourcePdf: sportMessiArgentinaPdf },
];

export const sizes = [
  { label: "M 22.5x18.5", price: 59 },
  { label: "L 60x30", price: 89 },
  { label: "XL 80x30", price: 119 },
];

export function getDesignsByCategory(categoryId: string): PadDesign[] {
  return padDesigns.filter((p) => p.category === categoryId);
}

export function orderOnWhatsApp(product: string) {
  const message = encodeURIComponent("שלום PADZONE אני רוצה להזמין: " + product);
  window.open("https://wa.me/972552589255?text=" + message);
}
