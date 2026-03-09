// Original pads
import padNeonStrike from "@/assets/pad-neon-strike.jpg";
import padGalaxy from "@/assets/pad-galaxy.jpg";
import padCyberGrid from "@/assets/pad-cyber-grid.jpg";
import padLava from "@/assets/pad-lava.jpg";
import padAnime from "@/assets/pad-anime.jpg";
import padRgbWave from "@/assets/pad-rgb-wave.jpg";
import padDarkPro from "@/assets/pad-dark-pro.jpg";
import padLightning from "@/assets/pad-lightning.jpg";

// New designs
import design1 from "@/assets/pads/abstract-1.png";
import design2 from "@/assets/pads/design-2.jpg";
import design3 from "@/assets/pads/design-3.jpg";
import design4 from "@/assets/pads/design-4.jpg";
import design5 from "@/assets/pads/design-5.jpg";
import design6 from "@/assets/pads/design-6.jpg";
import design7 from "@/assets/pads/design-7.jpg";
import design8 from "@/assets/pads/design-8.jpg";
import design9 from "@/assets/pads/design-9.jpg";
import design10 from "@/assets/pads/design-10.jpg";
import design11 from "@/assets/pads/design-11.jpg";
import design12 from "@/assets/pads/design-12.jpg";
import design13 from "@/assets/pads/design-13.jpg";
import design14 from "@/assets/pads/design-14.jpg";
import design15 from "@/assets/pads/design-15.jpg";
import design16 from "@/assets/pads/design-16.jpg";
import design17 from "@/assets/pads/design-17.jpg";
import design18 from "@/assets/pads/design-18.jpg";
import design19 from "@/assets/pads/design-19.png";
import design20 from "@/assets/pads/design-20.jpg";
import design21 from "@/assets/pads/design-21.jpg";
import design22 from "@/assets/pads/design-22.jpg";
import design23 from "@/assets/pads/design-23.png";
import design24 from "@/assets/pads/design-24.jpg";
import design25 from "@/assets/pads/design-25.jpg";
import design26 from "@/assets/pads/design-26.jpg";
import design27 from "@/assets/pads/design-27.png";

export interface PadDesign {
  id: string;
  title: string;
  image: string;
  category: string;
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
    id: "3d",
    title: "תלת מימד",
    icon: "🧊",
    coverImage: design10,
    description: "עיצובים תלת מימדיים מרהיבים"
  },
  {
    id: "cyber",
    title: "סייבר וטכנולוגיה",
    icon: "🔮",
    coverImage: design14,
    description: "מנהרות דיגיטליות וגרידים עתידניים"
  },
  {
    id: "abstract",
    title: "מופשט",
    icon: "🌀",
    coverImage: design7,
    description: "צורות אורגניות ודפוסים ייחודיים"
  },
  {
    id: "colorful",
    title: "צבעוני",
    icon: "🎨",
    coverImage: design19,
    description: "עיצובים צבעוניים ומלאי חיים"
  },
  {
    id: "dark",
    title: "כהה ומינימלי",
    icon: "🖤",
    coverImage: design26,
    description: "עיצובים כהים ואלגנטיים"
  },
  {
    id: "gaming",
    title: "גיימינג",
    icon: "🎮",
    coverImage: padNeonStrike,
    description: "פדים בסגנון גיימינג קלאסי"
  },
];

export const padDesigns: PadDesign[] = [
  // 3D
  { id: "3d-1", title: "Red Grid 3D", image: design2, category: "3d" },
  { id: "3d-2", title: "Red Cubes", image: design10, category: "3d" },
  { id: "3d-3", title: "Blue Cube Gold", image: design14, category: "3d" },
  { id: "3d-4", title: "Colorful Blocks", image: design19, category: "3d" },
  { id: "3d-5", title: "3D Cubes Dark", image: design11, category: "3d" },
  
  // Cyber
  { id: "cyber-1", title: "Cyber Tunnel", image: design22, category: "cyber" },
  { id: "cyber-2", title: "Neon City", image: design23, category: "cyber" },
  { id: "cyber-3", title: "Blue Tunnel", image: design14, category: "cyber" },
  { id: "cyber-4", title: "Sci-Fi Corridor", image: design24, category: "cyber" },
  { id: "cyber-5", title: "Hexagon Grid", image: design18, category: "cyber" },
  { id: "cyber-6", title: "Cyber Grid", image: padCyberGrid, category: "cyber" },
  
  // Abstract
  { id: "abs-1", title: "Dark Flower", image: design3, category: "abstract" },
  { id: "abs-2", title: "Red Spiral", image: design7, category: "abstract" },
  { id: "abs-3", title: "Green Rings", image: design5, category: "abstract" },
  { id: "abs-4", title: "Liquid Fire", image: design22, category: "abstract" },
  { id: "abs-5", title: "Abstract Flow", image: design1, category: "abstract" },
  { id: "abs-6", title: "Dark Spheres", image: design26, category: "abstract" },
  { id: "abs-7", title: "Gold Waves", image: design13, category: "abstract" },
  
  // Colorful
  { id: "col-1", title: "Rainbow Bars", image: design17, category: "colorful" },
  { id: "col-2", title: "Pink Blocks", image: design19, category: "colorful" },
  { id: "col-3", title: "RGB Wave", image: padRgbWave, category: "colorful" },
  { id: "col-4", title: "Galaxy Burst", image: padGalaxy, category: "colorful" },
  { id: "col-5", title: "Hexagon Gradient", image: design18, category: "colorful" },
  
  // Dark
  { id: "dark-1", title: "Dark Spheres", image: design26, category: "dark" },
  { id: "dark-2", title: "Dark Pro", image: padDarkPro, category: "dark" },
  { id: "dark-3", title: "Dark Cubes", image: design4, category: "dark" },
  { id: "dark-4", title: "Black Lightning", image: design15, category: "dark" },
  { id: "dark-5", title: "Shadow Grid", image: design9, category: "dark" },
  { id: "dark-6", title: "Dark DNA", image: design16, category: "dark" },
  { id: "dark-7", title: "Noir Texture", image: design12, category: "dark" },
  
  // Gaming
  { id: "game-1", title: "Neon Strike", image: padNeonStrike, category: "gaming" },
  { id: "game-2", title: "Lava Gaming", image: padLava, category: "gaming" },
  { id: "game-3", title: "Anime Power", image: padAnime, category: "gaming" },
  { id: "game-4", title: "Lightning", image: padLightning, category: "gaming" },
  { id: "game-5", title: "Fire Abstract", image: design6, category: "gaming" },
  { id: "game-6", title: "Red Energy", image: design8, category: "gaming" },
  { id: "game-7", title: "Neon Bars", image: design20, category: "gaming" },
  { id: "game-8", title: "Electric Blue", image: design21, category: "gaming" },
  { id: "game-9", title: "Dark Grid", image: design25, category: "gaming" },
  { id: "game-10", title: "Anime Girls RGB", image: design27, category: "gaming" },
];

export const sizes = [
  { label: "Large 45x40", price: 69 },
  { label: "XL 80x40", price: 89 },
  { label: "XXL 90x40", price: 109 },
];

export function getDesignsByCategory(categoryId: string): PadDesign[] {
  return padDesigns.filter((p) => p.category === categoryId);
}

export function orderOnWhatsApp(product: string) {
  const message = encodeURIComponent("שלום PADZONE אני רוצה להזמין: " + product);
  window.open("https://wa.me/972552589255?text=" + message);
}
