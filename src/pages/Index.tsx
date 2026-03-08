import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ShopSection from "@/components/ShopSection";
import CustomPadSection from "@/components/CustomPadSection";
import WhatsAppButton from "@/components/WhatsAppButton";

type Section = "hero" | "shop" | "custom";

const Index = () => {
  const [section, setSection] = useState<Section>("hero");

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <button onClick={() => setSection("hero")} className="text-primary font-black text-2xl neon-text">
            PADZONE
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setSection("shop")}
              className={`font-semibold transition-colors ${section === "shop" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              חנות
            </button>
            <button
              onClick={() => setSection("custom")}
              className={`font-semibold transition-colors ${section === "custom" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              עיצוב אישי
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {section === "hero" && <HeroSection onNavigate={setSection} />}
        {section === "shop" && <ShopSection />}
        {section === "custom" && <CustomPadSection />}
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default Index;
