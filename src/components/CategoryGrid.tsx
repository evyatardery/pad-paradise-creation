import { motion } from "framer-motion";
import { categories, getDesignsByCategory } from "@/data/catalog";

interface Props {
  onSelect: (categoryId: string) => void;
}

const CategoryGrid = ({ onSelect }: Props) => {
  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-primary neon-text text-center mb-2">הקולקציה שלנו</h2>
      <p className="text-muted-foreground text-center mb-12 text-lg">בחר קטגוריה וגלה עיצובים מטורפים</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, i) => {
          const count = getDesignsByCategory(cat.id).length;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => onSelect(cat.id)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-border hover:border-primary transition-all duration-300"
              style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px hsl(187 100% 50% / 0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
            >
              <img
                src={cat.coverImage}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-center">
                <span className="text-3xl mb-2 block drop-shadow-lg">{cat.icon}</span>
                <h3 className="text-primary font-black text-xl neon-text">{cat.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{count} עיצובים</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
