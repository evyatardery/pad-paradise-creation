import { useState } from "react";
import CategoryGrid from "./CategoryGrid";
import CategoryGallery from "./CategoryGallery";

const ShopSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory) {
    return (
      <CategoryGallery
        categoryId={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return <CategoryGrid onSelect={setSelectedCategory} />;
};

export default ShopSection;
