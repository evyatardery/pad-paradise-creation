import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { padDesigns } from "@/data/catalog";

interface HeroSectionProps {
  onNavigate: (section: "shop" | "custom") => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Full hero background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="רקע משטחי עכבר PadZone לגיימרים" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl md:text-9xl font-black text-primary neon-text-strong mb-2 tracking-widest">
            PADZONE
          </h1>
          <div className="h-1 w-32 mx-auto bg-primary rounded-full mb-6 neon-box" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl md:text-3xl text-card-foreground font-bold mb-3"
        >
          משטחי עכבר פרימיום שמשדרגים כל עמדה
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-10"
        >
          מעל 30 עיצובים מוכנים או עיצוב אישי משלך
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => onNavigate("shop")}
            className="relative px-10 py-4 bg-primary text-primary-foreground font-black rounded-xl text-lg hover:scale-105 transition-transform neon-box-strong"
          >
            חנות פדים
            <span className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-background animate-pulse">
              {padDesigns.length}
            </span>
          </button>
          <button
            onClick={() => onNavigate("custom")}
            className="px-10 py-4 border-2 border-primary text-primary font-black rounded-xl text-lg hover:bg-primary hover:text-primary-foreground transition-all backdrop-blur-sm bg-background/30"
          >
            עצב פד אישי
          </button>
        </motion.div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex gap-8 justify-center mt-16 flex-wrap"
        >
          {[
            { text: "דיוק צבע מושלם" },
            { text: "עמיד לשנים" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-card-foreground/80">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-semibold">{f.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
