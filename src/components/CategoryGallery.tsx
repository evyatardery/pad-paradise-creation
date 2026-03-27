import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getDesignsByCategory, categories, PadDesign, sizes } from "@/data/catalog";
import PadModal from "./PadModal";

interface Props {
  categoryId: string;
  onBack: () => void;
}

const CategoryGallery = ({ categoryId, onBack }: Props) => {
  const [selectedPad, setSelectedPad] = useState<PadDesign | null>(null);
  const designs = getDesignsByCategory(categoryId);
  const category = categories.find((c) => c.id === categoryId);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowRight size={20} />
          <span className="font-semibold">חזרה לקטגוריות</span>
        </button>
        <h2 className="text-4xl font-bold text-primary neon-text">
          {category?.icon} {category?.title}
        </h2>
        <p className="text-muted-foreground mt-2">{designs.length} עיצובים</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {designs.map((pad, i) => (
          <motion.button
            key={pad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            onClick={() => setSelectedPad(pad)}
            className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary transition-all duration-300"
            style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px hsl(187 100% 50% / 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={pad.image}
                alt={`משטח עכבר דגם ${pad.title} – PadZone`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center border-t border-border">
              <h4 className="text-card-foreground font-bold text-sm">{pad.title}</h4>
              <p className="text-primary text-xs font-bold mt-1">החל מ-₪{sizes[0].price}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <PadModal pad={selectedPad} onClose={() => setSelectedPad(null)} />
    </section>
  );
};

export default CategoryGallery;
