import { useEffect, useState } from 'react';
import type { Club } from '../data/clubs';
import { asset } from '../data/clubs';

interface ClubLogoItemProps {
  club: Club;
  onClick: (id: string) => void;
}

/**
 * Gallery tile: the club logo, its name, and an elliptical under-glow in the
 * club's theme color — no card frame, no category chip. Loaded from
 * public/logos/{id}.png (or .jpg as fallback). Clicking opens the club preview.
 */
export default function ClubLogoItem({ club, onClick }: ClubLogoItemProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [club.id]);

  const id = club.id.padStart(2, '0');
  const candidates = [`/logos/${id}.png`, `/logos/${id}.jpg`, '/logos/no-logo.png'];
  const src = candidates[Math.min(index, candidates.length - 1)];

  const [, main] = club.theme ?? ['#d9efe6', '#34d399', '#0f3d2f'];

  return (
    <button
      onClick={() => onClick(club.id)}
      className="group relative flex h-full w-full cursor-pointer select-none flex-col items-center pt-3"
      aria-label={club.name}
      title={club.name}
    >
      <div className="mb-1">
        <span className="text-base font-semibold text-white drop-shadow-sm sm:text-lg">{club.name}</span>
      </div>

      <img
        src={asset(src)}
        alt=""
        loading="lazy"
        className="relative z-10 max-h-[60%] w-auto max-w-full object-contain transition-opacity duration-300 group-active:brightness-75"
        onError={() => setIndex((i) => i + 1)}
      />

      {/* Elliptical under-glow below the logo — a wide, flat ellipse in the
          club's theme color, brightest under the logo and fading down and out.
          Bottom-anchored so every glow in a row shares the same absolute
          height regardless of logo aspect ratio. Wider than the cell so
          adjacent glows overlap into one continuous band (no dark seam). */}
      <div
        className="pointer-events-none absolute bottom-1 left-1/2 h-[44px] w-[140%] -translate-x-1/2 rounded-[50%] sm:h-[72px]"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${main}59, ${main}26 55%, transparent 82%)`,
        }}
      />
    </button>
  );
}
