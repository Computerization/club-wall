import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-[#1A5F4A] text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold tracking-wide">Club Wall</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索社团名称..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 text-white placeholder-white/60 
                       outline-none focus:bg-white/30 transition-colors text-sm"
          />
        </div>
      </div>
    </header>
  );
}
