import { CATEGORIES } from "@/src/constants";
import { Category } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { 
  Briefcase, 
  Home, 
  ShoppingBag, 
  GlassWater, 
  Megaphone, 
  UtensilsCrossed 
} from "lucide-react";

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
  dict: any;
}

const ICONS: Record<string, any> = {
  jobs: Briefcase,
  realestate: Home,
  market: ShoppingBag,
  drink: GlassWater,
  promo: Megaphone,
  food: UtensilsCrossed
};

export default function CategoryNav({ selectedCategory, onSelect, dict }: CategoryNavProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
          selectedCategory === null 
            ? "bg-[#0B3D91] text-white shadow-lg shadow-[#0B3D91]/40 scale-[1.02]" 
            : "text-white/60 hover:text-white hover:bg-white/5"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          selectedCategory === null ? "bg-white/20" : "bg-white/5"
        )}>
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
        </div>
        <span>{dict.labels.all}</span>
      </button>

      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat];
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              selectedCategory === cat 
                ? "bg-[#0B3D91] text-white shadow-lg shadow-[#0B3D91]/40 scale-[1.02]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              selectedCategory === cat ? "bg-white/20" : "bg-white/5"
            )}>
              <Icon size={18} />
            </div>
            <span>{dict.menu[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}
