import { useState } from "react";
import { motion } from "framer-motion";
import { Pad, sizes, orderOnWhatsApp } from "@/data/pads";

const PadCard = ({ pad, index }: { pad: Pad; index: number }) => {
  const [sizeIdx, setSizeIdx] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden neon-box hover:neon-box-strong transition-shadow"
    >
      <img src={pad.image} alt={pad.title} className="w-full h-48 object-cover" />
      <div className="p-4 text-center">
        <h3 className="text-primary font-bold text-lg mb-2">{pad.title}</h3>
        <select
          value={sizeIdx}
          onChange={(e) => setSizeIdx(Number(e.target.value))}
          className="bg-input text-card-foreground rounded-md px-3 py-2 mb-3 w-full"
        >
          {sizes.map((s, i) => (
            <option key={i} value={i}>
              {s.label} - ₪{s.price}
            </option>
          ))}
        </select>
        <button
          onClick={() => orderOnWhatsApp(`${pad.title} - ${sizes[sizeIdx].label}`)}
          className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:scale-105 transition-transform"
        >
          הזמן בוואטסאפ
        </button>
      </div>
    </motion.div>
  );
};

export default PadCard;
