import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, clubs } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';

const computerizationClub = clubs.find((club) => club.name.includes('信息化'));

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** When true, hides the category jump-rail (e.g. on search/detail views). */
  minimal?: boolean;
}

export default function Header({ searchQuery, onSearchChange, onSearchKeyDown, minimal = false }: HeaderProps) {
  // Under HashRouter the URL hash is owned by the router, so a native
  // `href="#cat-X"` anchor would be read as a route instead of scrolling.
  // Scroll to the section ourselves and leave the route untouched.
  const jumpToCategory = (e: React.MouseEvent, cat: string) => {
    e.preventDefault();
    document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-6">
        {/* Wordmark */}
        <div className="flex shrink-0 items-center gap-2">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg ring-1"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-light) 15%, transparent)',
                borderColor: 'color-mix(in srgb, var(--theme-light) 40%, transparent)',
                boxShadow: '0 0 0 1px color-mix(in srgb, var(--theme-light) 40%, transparent)',
                transition: 'background-color 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease',
              }}
            >
              <span className="font-display text-lg font-bold" style={{ color: 'var(--theme-light)', transition: 'color 0.6s ease' }}>C</span>
            </span>
            <span className="hidden font-display text-lg font-semibold tracking-tight text-white sm:block">
              Club Wall
            </span>
          </a>
          {computerizationClub && (
            <Link
              to={`/club/${computerizationClub.id}`}
              className="hidden text-xs text-white/35 transition-colors hover:text-brand-light sm:block"
            >
              by Computerization
            </Link>
          )}
        </div>

        {/* Category jump-rail */}
        {!minimal && (
          <nav className="scrollbar-hide hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
            {categories.map((cat) => {
              const meta = getCategoryMeta(cat);
              return (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  onClick={(e) => jumpToCategory(e, cat)}
                  className="group relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-white/65 transition-colors hover:text-white"
                >
                  {meta.en}
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: meta.accent }}
                  />
                </a>
              );
            })}
          </nav>
        )}

        {/* Search */}
        <div className={`relative ${minimal ? 'ml-auto w-full max-w-md' : 'ml-auto w-44 sm:w-64'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="搜索社团…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white
                       placeholder-white/40 outline-none transition-all duration-200
                       focus:border-brand-light/50 focus:bg-white/10 focus:ring-2 focus:ring-brand-light/20"
          />
        </div>
      </div>
    </header>
  );
}
