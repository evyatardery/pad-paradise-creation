import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PadDesign, sizes } from "@/data/catalog";
import DeskMockup from "./DeskMockup";

interface Props {
  pad: PadDesign | null;
  onClose: () => void;
}

const PadModal = ({ pad, onClose }: Props) => {
  const [sizeIdx, setSizeIdx] = useState(1);
  const [showMockup, setShowMockup] = useState(false);
  const navigate = useNavigate();

  if (!pad) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto neon-box-strong"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-primary font-bold text-xl neon-text">{pad.title}</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Toggle view */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowMockup(false)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  !showMockup
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                תמונה מקורית
              </button>
              <button
                onClick={() => setShowMockup(true)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  showMockup
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                🖥️ על השולחן
              </button>
            </div>

            {/* Image / Mockup */}
            {showMockup ? (
              <DeskMockup designImage={pad.image} designTitle={pad.title} sizeLabel={sizes[sizeIdx].label} />
            ) : (
              <img
                src={pad.image}
                alt={pad.title}
                className="w-full rounded-xl aspect-video object-cover neon-box"
              />
            )}

            {/* Size selector */}
            <div className="space-y-3">
              <label className="block text-card-foreground font-semibold">בחר גודל:</label>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSizeIdx(i)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      sizeIdx === i
                        ? "border-primary bg-primary/10 text-primary neon-box"
                        : "border-border bg-secondary text-secondary-foreground hover:border-primary/50"
                    }`}
                  >
                    <div className="font-bold text-sm">{s.label.split(" ")[0]}</div>
                    <div className="text-xs text-muted-foreground">{s.label.split(" ")[1]}</div>
                    <div className="font-black text-lg mt-1">₪{s.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order button */}
            <button
              onClick={() => navigate(`/checkout?design=${encodeURIComponent(pad.id)}&name=${encodeURIComponent(pad.title)}&size=${sizeIdx}`)}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-lg hover:scale-[1.02] transition-transform neon-box animate-pulse-glow"
            >
              🚀 זה שלי! להשלמת ההזמנה
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PadModal;
