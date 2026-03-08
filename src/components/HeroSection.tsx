import { motion } from "framer-motion";

interface HeroSectionProps {
  onNavigate: (section: "shop" | "custom") => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-black text-primary neon-text-strong mb-6"
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
        בחר פד מוכן או עצב אחד משלך
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <button
          onClick={() => onNavigate("shop")}
          className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg hover:scale-105 transition-transform neon-box"
        >
          🎮 חנות פדים
        </button>
        <button
          onClick={() => onNavigate("custom")}
          className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg text-lg hover:bg-primary hover:text-primary-foreground transition-all"
        >
          🎨 עצב פד אישי
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
