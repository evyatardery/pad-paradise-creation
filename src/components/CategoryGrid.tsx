import { motion } from "framer-motion";
import { categories } from "@/data/catalog";

interface Props {
  onSelect: (categoryId: string) => void;
}

const CategoryGrid = ({ onSelect }: Props) => {
  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-primary neon-text text-center mb-4">הקולקציה שלנו</h2>
      <p className="text-muted-foreground text-center mb-12 text-lg">בחר קטגוריה וגלה עיצובים מטורפים</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onClick={() => onSelect(cat.id)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] neon-box hover:neon-box-strong transition-all"
          >
            <img
              src={cat.coverImage}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-center">
              <span className="text-3xl mb-1 block">{cat.icon}</span>
              <h3 className="text-primary font-bold text-lg neon-text">{cat.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">{cat.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
