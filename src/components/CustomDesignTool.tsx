import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Type } from "lucide-react";
import { sizes, orderOnWhatsApp } from "@/data/catalog";
import DeskMockup from "./DeskMockup";

const fonts = [
  { label: "קלאסי", value: "'Poppins', sans-serif" },
  { label: "מודגש", value: "'Impact', sans-serif" },
  { label: "אלגנטי", value: "'Georgia', serif" },
  { label: "טכנו", value: "'Courier New', monospace" },
];

type TextAlign = "right" | "center" | "left";

const CustomDesignTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontIdx, setFontIdx] = useState(0);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [sizeIdx, setSizeIdx] = useState(1);
  const [showMockup, setShowMockup] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const alignPositions: Record<TextAlign, string> = {
    right: "right-4",
    center: "left-1/2 -translate-x-1/2",
    left: "left-4",
  };

  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-primary neon-text text-center mb-4">🎨 עיצוב פד אישי</h2>
      <p className="text-muted-foreground text-center mb-12">העלה תמונה, הוסף טקסט, ואנחנו נדפיס!</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Upload */}
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">📷 העלה תמונה</label>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors group"
          >
            <Upload className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" size={32} />
            <p className="text-muted-foreground group-hover:text-primary transition-colors">
              {image ? "לחץ להחלפת תמונה" : "לחץ להעלאת תמונה"}
            </p>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Text */}
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">
            <Type size={16} className="inline ml-2" />
            טקסט לפד
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="כתוב טקסט לפד..."
            className="w-full bg-input text-card-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Font + Align */}
        {text && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-card-foreground mb-2 font-semibold text-sm">פונט</label>
              <div className="flex flex-wrap gap-2">
                {fonts.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setFontIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      fontIdx === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-card-foreground mb-2 font-semibold text-sm">מיקום טקסט</label>
              <div className="flex gap-2">
                {(["right", "center", "left"] as TextAlign[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setTextAlign(a)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      textAlign === a
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {a === "right" ? "ימין" : a === "center" ? "מרכז" : "שמאל"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Size */}
        <div>
          <label className="block text-card-foreground mb-2 font-semibold">📐 גודל</label>
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

        {/* Preview */}
        {image && (
          <div className="space-y-3">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowMockup(false)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  !showMockup
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                תצוגה מקדימה
              </button>
              <button
                onClick={() => setShowMockup(true)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  showMockup
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                🖥️ על השולחן
              </button>
            </div>

            {showMockup ? (
              <DeskMockup
                designImage={image}
                designTitle="Custom Pad"
                sizeLabel={sizes[sizeIdx].label}
                overlayText={text || undefined}
                overlayFont={fonts[fontIdx].value}
                overlayAlign={textAlign}
              />
            ) : (
              <div className="border-2 border-primary rounded-xl overflow-hidden aspect-video bg-secondary relative">
                <img src={image} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
                {text && (
                  <div
                    className={`absolute bottom-4 ${alignPositions[textAlign]} text-primary font-bold text-2xl neon-text bg-background/70 px-4 py-2 rounded-lg`}
                    style={{ fontFamily: fonts[fontIdx].value }}
                  >
                    {text}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!image && (
          <div className="border-2 border-border rounded-xl aspect-video bg-secondary flex items-center justify-center">
            <p className="text-muted-foreground">העלה תמונה כדי לראות תצוגה מקדימה</p>
          </div>
        )}

        {/* Order */}
        <button
          onClick={() =>
            orderOnWhatsApp(
              `פד מותאם אישית - ${sizes[sizeIdx].label}${text ? ` - טקסט: ${text}` : ""}`
            )
          }
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-lg hover:scale-[1.02] transition-transform neon-box animate-pulse-glow"
        >
          📱 הזמן עכשיו בוואטסאפ - ₪{sizes[sizeIdx].price}
        </button>
      </motion.div>
    </section>
  );
};

export default CustomDesignTool;
