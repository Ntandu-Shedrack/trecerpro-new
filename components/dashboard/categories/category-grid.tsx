import { Category } from "./category.types";
import CategoryCard from "./category-card";

type Props = {
  categories: Category[];
  onEdit: (category: Category) => void;
};

export default function CategoryGrid({ categories, onEdit }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} onEdit={() => onEdit(cat)} />
      ))}
    </div>
  );
}
