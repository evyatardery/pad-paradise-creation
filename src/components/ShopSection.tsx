import { pads } from "@/data/pads";
import PadCard from "./PadCard";

const ShopSection = () => {
  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-primary neon-text text-center mb-12">כל הפדים</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {pads.map((pad, i) => (
          <PadCard key={pad.title} pad={pad} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ShopSection;
