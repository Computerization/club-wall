import { useMemo, useState } from 'react';
import { pinyin } from 'pinyin-pro';
import type { Club } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';
import { asset } from '../data/clubs';

function getGroupKey(name: string): string {
  const first = name.charAt(0);
  if (/[0-9]/.test(first)) return '#';
  if (/[A-Za-z]/.test(first)) return first.toUpperCase();
  const py = pinyin(first, { pattern: 'first', toneType: 'none' });
  return py ? py.charAt(0).toUpperCase() : '#';
}

function isEnglishStart(name: string): boolean {
  return /[A-Za-z]/.test(name.charAt(0));
}

// Shows the club's logo thumbnail; if the logo file is missing (or fails to
// load), falls back to a gray translucent circle (same size) to indicate there
// is no logo.
function ClubDot({ club, light }: { club: Club; light: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={`h-5 w-5 shrink-0 rounded-full ${light ? 'bg-black/10' : 'bg-neutral-800/90'}`} />;
  }

  return (
    <img
      src={asset(`/logos/${club.id.padStart(2, '0')}.png`)}
      alt=""
      className="h-5 w-5 shrink-0 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

interface ClubDropdownProps {
  clubs: Club[];
  onClubClick: (id: string) => void;
  /** Dropdown sits on a light page (white/purple top) → use light skin. */
  light?: boolean;
}

export default function ClubDropdown({ clubs, onClubClick, light = false }: ClubDropdownProps) {
  const groups = useMemo(() => {
    const map = new Map<string, Club[]>();

    for (const club of clubs) {
      const key = getGroupKey(club.name);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(club);
    }

    for (const [, group] of map) {
      group.sort((a, b) => {
        const aEng = isEnglishStart(a.name);
        const bEng = isEnglishStart(b.name);
        if (aEng && !bEng) return -1;
        if (!aEng && bEng) return 1;
        return a.name.localeCompare(b.name, 'zh-CN');
      });
    }

    const sortedKeys = Array.from(map.keys()).sort((a, b) => {
      if (a === '#') return -1;
      if (b === '#') return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => ({ key, items: map.get(key)! }));
  }, [clubs]);

  return (
    <div
      className={`absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border shadow-lift backdrop-blur-xl ${
        light ? 'border-black/10 bg-white/70' : 'border-white/10 bg-ink-900/80'
      }`}
    >
      <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
        {groups.map(({ key, items }) => (
          <div key={key}>
            <div
              className={`sticky top-0 px-3 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                light ? 'bg-white/55 text-black/55' : 'bg-ink-900/60 text-white/55'
              }`}
            >
              {key === '#' ? '#' : key}
            </div>
            {items.map((club) => {
              const meta = getCategoryMeta(club.category);
              return (
                <button
                  key={club.id}
                  onClick={() => onClubClick(club.id)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors active:opacity-80 ${
                    light
                      ? 'text-black/75 hover:bg-black/[0.05] hover:text-black'
                      : 'text-white/75 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <ClubDot club={club} light={light} />
                  <span className="truncate">{club.name}</span>
                  <span
                    className={`ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wider ${
                      light ? 'text-black/35' : 'text-white/30'
                    }`}
                  >
                    {meta.en}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
