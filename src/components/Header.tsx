import { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, clubs, asset } from '../data/clubs';
import type { Rating } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';
import ClubDropdown from './ClubDropdown';

const computerizationClub = clubs.find((club) => club.name.includes('信息化'));

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** When true, hides the category jump-rail (e.g. on search/detail views). */
  minimal?: boolean;
  onClubClick?: (id: string) => void;
  ratingFilter?: Set<Rating>;
  onRatingFilter?: (filter: Set<Rating>) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  /** 'purple' = light-mode, page still at the top; 'light' = light mode, white; 'dark'. */
  headerMode?: 'purple' | 'light' | 'dark';
}

export default function Header({ searchQuery, onSearchChange, onSearchKeyDown, minimal = false, onClubClick, ratingFilter, onRatingFilter, theme, onToggleTheme, headerMode = 'dark' }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Single-select: only 五星社团 or 优秀社团 at a time (click again to clear).
  const toggleRating = (rating: Rating) => {
    if (!onRatingFilter) return;
    const next = new Set<Rating>();
    if (!ratingFilter?.has(rating)) next.add(rating);
    onRatingFilter(next);
  };

  const handleClubClick = (id: string) => {
    setDropdownOpen(false);
    onClubClick?.(id);
  };

  // Modes: purple (light page top), light (white bar), dark.
  const purple = headerMode === 'purple';
  const onWhite = headerMode === 'light';

  // Under HashRouter the URL hash is owned by the router, so a native
  // `href="#cat-X"` anchor would be read as a route instead of scrolling.
  // Scroll to the section ourselves and leave the route untouched.
  const jumpToCategory = (e: React.MouseEvent, cat: string) => {
    e.preventDefault();
    document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const barClass = purple
    ? 'bg-[#5D4789] border-white/25'
    : onWhite
      ? 'bg-white/90 border-black/10'
      : 'glass border-white/10';

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${barClass}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-6">
        {/* Wordmark */}
        <div className="flex shrink-0 items-center gap-2">
          <a href="/club-wall/" className="flex items-center gap-2.5">
            <img src={asset('icons/WFLA.png')} alt="Club Wall" className="h-6 w-auto object-contain" />
            <span className={`hidden font-display font-bold tracking-tight sm:block ${purple || !onWhite ? 'text-white' : 'text-ink-900'}`}>
              Club Wall
            </span>
          </a>
          {computerizationClub && (
            <Link
              to={`/club/${computerizationClub.id}`}
              className={`hidden text-xs font-semibold transition-colors active:brightness-50 sm:block ${
                onWhite
                  ? 'text-black/65 hover:text-black'
                  : purple
                    ? 'text-white/85 hover:text-white'
                    : 'text-white/60 hover:text-white'
              }`}
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
                  className={`group relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                    onWhite
                      ? 'font-semibold text-black/75 hover:text-black'
                      : purple
                        ? 'text-white/90 hover:text-white'
                        : 'text-white/75 hover:text-white'
                  }`}
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

        {/* Rating filter buttons */}
        {onRatingFilter && (
          <div className="flex shrink-0 items-center gap-1">
            {(['five-star', 'outstanding'] as Rating[]).map((rating) => {
              const active = ratingFilter?.has(rating) ?? false;
              return (
                <button
                  key={rating}
                  onClick={() => toggleRating(rating)}
                  aria-pressed={active}
                  className={`flex flex-col items-center rounded-full px-2.5 py-1 text-[10px] leading-none transition-colors active:brightness-50 ${
                    active
                      ? 'font-semibold'
                      : onWhite
                        ? 'text-black/70 hover:text-black'
                        : purple
                          ? 'text-white/90 hover:text-white'
                          : 'text-white/70 hover:text-white/85'
                  }`}
                  style={
                    active
                      ? { color: 'var(--theme-light)', background: 'color-mix(in srgb, var(--theme-light) 15%, transparent)' }
                      : undefined
                  }
                >
                  <img
                    src={asset(rating === 'five-star' ? 'icons/five-star-club.png' : 'icons/good-club.png')}
                    alt=""
                    className="h-4 w-4 object-contain"
                  />
                  <span>{rating === 'five-star' ? '五星社团' : '优秀社团'}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Light/dark toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label="切换明暗模式"
            title="切换深色/浅色模式"
            className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors active:brightness-50 md:ml-0 ${
              onWhite
                ? 'text-black/65 hover:bg-black/5 hover:text-black'
                : purple
                  ? 'text-white hover:bg-white/15'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        {/* Search */}
        <div ref={containerRef} className={`relative ${minimal ? 'ml-auto w-full max-w-md' : 'w-44 sm:w-64'}`}>
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${onWhite ? 'text-black/45' : 'text-white/70'}`}
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setDropdownOpen(false);
              onSearchKeyDown?.(e);
            }}
            placeholder="搜索社团…"
            className={`w-full rounded-full border py-2 pl-9 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-light/25 ${
              onWhite
                ? 'border-black/15 bg-black/5 text-ink-950 placeholder-black/45 focus:border-brand/40 focus:bg-white/80'
                : purple
                  ? 'border-white/25 bg-white/15 text-white placeholder-white/70 focus:border-white/50 focus:bg-white/20'
                  : 'border-white/10 bg-white/5 text-white placeholder-white/45 focus:border-brand-light/50 focus:bg-white/10'
            }`}
          />
          {dropdownOpen && onClubClick && searchQuery.length === 0 && (
            <ClubDropdown clubs={clubs} onClubClick={handleClubClick} light={onWhite || purple} />
          )}
        </div>
      </div>
    </header>
  );
}
