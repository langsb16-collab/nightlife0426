import { LANGUAGES } from "@/src/constants";
import { Globe } from "lucide-react";

interface LangSwitcherProps {
  currentLang: string;
  onSelect: (lang: string) => void;
}

export default function LangSwitcher({ currentLang, onSelect }: LangSwitcherProps) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium transition-all">
        <Globe size={14} className="text-blue-400" />
        <span>{LANGUAGES.find(l => l.code === currentLang)?.name}</span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-[#0b1f3a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <div className="max-h-64 overflow-y-auto py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="w-full text-left px-4 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
