import type { Category } from '../data/clubs';
import { categories } from '../data/clubs';

interface FilterProps {
  selected: Category | 'All';
  onSelect: (category: Category | 'All') => void;
}

export default function CategoryFilter({ selected, onSelect }: FilterProps) {
  const allCategories: ('All' | Category)[] = ['All', ...categories];

  return (
    <section className="py-6 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {allCategories.map((cat) => (
            <FilterButton
              key={cat}
              label={cat}
              isActive={selected === cat}
              onClick={() => onSelect(cat)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-[#1A5F4A] text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {label}
    </button>
  );
}
