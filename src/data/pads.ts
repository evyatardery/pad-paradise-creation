import padNeonStrike from "@/assets/pad-neon-strike.jpg";
import padGalaxy from "@/assets/pad-galaxy.jpg";
import padCyberGrid from "@/assets/pad-cyber-grid.jpg";
import padLava from "@/assets/pad-lava.jpg";
import padAnime from "@/assets/pad-anime.jpg";
import padRgbWave from "@/assets/pad-rgb-wave.jpg";
import padDarkPro from "@/assets/pad-dark-pro.jpg";
import padLightning from "@/assets/pad-lightning.jpg";

export interface Pad {
  title: string;
  image: string;
}

export const pads: Pad[] = [
  { title: "Neon Strike Pad", image: padNeonStrike },
  { title: "Galaxy Pad", image: padGalaxy },
  { title: "Cyber Grid Pad", image: padCyberGrid },
  { title: "Lava Gaming Pad", image: padLava },
  { title: "Anime Power Pad", image: padAnime },
  { title: "RGB Wave Pad", image: padRgbWave },
  { title: "Dark Pro Pad", image: padDarkPro },
  { title: "Lightning Pad", image: padLightning },
];

export const sizes = [
  { label: "Large 45x40", price: 69 },
  { label: "XL 80x40", price: 89 },
  { label: "XXL 90x40", price: 109 },
];

export function orderOnWhatsApp(product: string) {
  const message = encodeURIComponent("שלום PADZONE אני רוצה להזמין: " + product);
  window.open("https://wa.me/972552589255?text=" + message);
}
