import { motion } from "framer-motion";
import { padDesigns } from "@/data/catalog";

interface HeroSectionProps {
  onNavigate: (section: "shop" | "custom") => void;
}

// Pick 6 random designs for the hero background strip
const heroImages = padDesigns.slice(0, 6);

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Animated background strip */}
      <div className="absolute inset-0 opacity-10">
        <div className="flex gap-4 animate-scroll h-full flex-wrap">
          {heroImages.map((p, i) => (
            <img key={i} src={p.image} alt="" className="h-48 w-auto object-cover rounded-lg" />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black text-primary neon-text-strong mb-6 tracking-wider"
        >
          PADZONE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-card-foreground mb-4"
        >
          פדים לגיימרים אמיתיים
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-10"
        >
          מעל 30 עיצובים מוכנים או עיצוב אישי משלך
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => onNavigate("shop")}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg hover:scale-105 transition-transform neon-box animate-pulse-glow"
          >
            🎮 חנות פדים
          </button>
          <button
            onClick={() => onNavigate("custom")}
            className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl text-lg hover:bg-primary hover:text-primary-foreground transition-all"
          >
            🎨 עצב פד אישי
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
