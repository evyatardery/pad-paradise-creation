import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { sizes, orderOnWhatsApp } from "@/data/pads";

const CustomPadSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sizeIdx, setSizeIdx] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-primary neon-text text-center mb-12">עיצוב פד אישי</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto space-y-5"
      >
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">העלה תמונה</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block w-full text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold file:cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">טקסט לפד</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="כתוב טקסט לפד"
            className="w-full bg-input text-card-foreground rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">גודל</label>
          <select
            value={sizeIdx}
            onChange={(e) => setSizeIdx(Number(e.target.value))}
            className="w-full bg-input text-card-foreground rounded-lg px-4 py-3"
          >
            {sizes.map((s, i) => (
              <option key={i} value={i}>
                {s.label} - ₪{s.price}
              </option>
            ))}
          </select>
        </div>

        {/* Preview */}
        <div className="border-2 border-primary rounded-xl overflow-hidden aspect-video bg-secondary relative">
          {image && <img src={image} alt="תצוגה מקדימה" className="w-full h-full object-cover" />}
          {text && (
            <div className="absolute bottom-3 right-3 text-primary font-bold text-2xl neon-text bg-background/70 px-3 py-1 rounded-md">
              {text}
            </div>
          )}
          {!image && !text && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              תצוגה מקדימה תופיע כאן
            </div>
          )}
        </div>

        <button
          onClick={() => orderOnWhatsApp(`פד מותאם אישית - ${sizes[sizeIdx].label}${text ? ` - טקסט: ${text}` : ""}`)}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg text-lg hover:scale-105 transition-transform neon-box"
        >
          הזמן בוואטסאפ
        </button>
      </motion.div>
    </section>
  );
};

export default CustomPadSection;
