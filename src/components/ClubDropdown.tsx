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
function ClubDot({ club }: { club: Club }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-800/90" />;
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
}

export default function ClubDropdown({ clubs, onClubClick }: ClubDropdownProps) {
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
    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg
                    border border-white/10 bg-ink-900/95 backdrop-blur-xl shadow-lift">
      <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
        {groups.map(({ key, items }) => (
          <div key={key}>
            <div className="sticky top-0 bg-ink-900/90 px-3 pb-0.5 pt-1 text-[10px] font-semibold
                            uppercase tracking-wider text-white/35 backdrop-blur-sm">
              {key === '#' ? '#' : key}
            </div>
            {items.map((club) => {
              const meta = getCategoryMeta(club.category);
              return (
                <button
                  key={club.id}
                  onClick={() => onClubClick(club.id)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs
                             text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white active:bg-white/10"
                >
                  <ClubDot club={club} />
                  <span className="truncate">{club.name}</span>
                  <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wider text-white/25">
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
