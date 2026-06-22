import { ArrowUpRight } from 'lucide-react';
import type { Club } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';

interface GalleryCardProps {
  club: Club;
  onClick: (id: string) => void;
  /** Disable interactions while a drag is in progress (marquee rows). */
  draggable?: boolean;
}

/**
 * The atomic unit of the gallery: a tall poster tile with a cinematic gradient
 * scrim, a color-coded category chip, and a hover state that lifts the tile,
 * deepens the image and reveals a "Preview" affordance. Fills its parent, so
 * the marquee fixes the width while the responsive grid lets it flex.
 */
export default function GalleryCard({ club, onClick }: GalleryCardProps) {
  const meta = getCategoryMeta(club.category);
  // The data has real photos in `image`; `poster` is usually empty — prefer
  // whichever exists so tiles are never blank.
  const src = club.poster || club.image;

  return (
    <article
      onClick={() => onClick(club.id)}
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl
                 bg-ink-800 shadow-card ring-1 ring-white/10 transition-all duration-500
                 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-lift"
      style={{ ['--accent' as string]: meta.accent }}
    >
      {/* Image */}
      {src ? (
        <img
          src={src}
          alt={club.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform
                     duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900 text-sm text-white/40">
          {club.name}
        </div>
      )}

      {/* Cinematic scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />

      {/* Accent glow ring on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1.5px var(--accent), 0 24px 60px -20px var(--accent)' }}
      />

      {/* Category chip */}
      <div className="absolute left-3 top-3 z-10">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid var(--accent)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          {meta.en}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <p
          className="mb-1 translate-y-1 text-[11px] font-medium uppercase tracking-[0.18em] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ color: 'var(--accent)' }}
        >
          {club.shortDesc}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-white drop-shadow-sm">
          {club.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-white/0 transition-colors duration-500 group-hover:text-white/90">
          <span>Preview</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </article>
  );
}
