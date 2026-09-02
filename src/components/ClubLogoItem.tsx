import { useEffect, useRef, useState } from 'react';
import type { Club } from '../data/clubs';
import { asset } from '../data/clubs';
import { setLogoFlyRect } from '../lib/logoFly';

interface ClubLogoItemProps {
  club: Club;
  onClick: (id: string) => void;
  /** True while the row is being drag-scrolled — tiles drop back to normal. */
  dragActive?: boolean;
  /** Gallery (tiled) mode: the name sits a little lower, closer to the logo. */
  gallery?: boolean;
}

type Interaction = 'idle' | 'hover' | 'press';

const MIN_NAME_PX = 12;

// Rough per-character advance width at font size `px`: CJK/wide glyphs occupy a
// full em, latin/digits roughly 0.55em. Used to keep names on a single line by
// shrinking the font when the name would overflow the tile.
function textWidth(name: string, px: number): number {
  let w = 0;
  for (const ch of name) {
    if (/\s/.test(ch)) w += px * 0.32;
    else if (/[\u2e80-\u9fff\uac00-\ud7af\u3040-\u30ff\u3000-\u303f\uff00-\uffef]/.test(ch)) w += px;
    else w += px * 0.56;
  }
  return w;
}

function fitNameFont(name: string, containerWidth: number): number {
  const base = window.innerWidth >= 640 ? 20 : 18;
  let px = base;
  const w = textWidth(name, px);
  if (containerWidth > 0 && w > containerWidth) {
    px = Math.max(MIN_NAME_PX, (base * containerWidth) / w);
  }
  return px;
}

function luminance(hex: string): number {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = m.slice(1).map((h) => lin(parseInt(h, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isLightScheme(): boolean {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr === 'light';
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

/**
 * Gallery tile: the club logo, its one-line name, and an elliptical under-glow
 * in the club's theme color — no card frame, no category chip. Loaded from
 * public/logos/{id}.png (or .jpg as fallback). Clicking opens the club preview.
 *
 * Interaction is strictly per-tile: hovering scales just this tile's logo up
 * from its own centre with a bounce; pressing shrinks it briefly. The glow
 * never moves and the row never reacts as a whole. While the row is being
 * drag-scrolled, the tile returns to its normal state.
 */
export default function ClubLogoItem({ club, onClick, dragActive = false, gallery = false }: ClubLogoItemProps) {
  const [index, setIndex] = useState(0);
  const [interaction, setInteraction] = useState<Interaction>('idle');
  const [namePx, setNamePx] = useState(18);
  const [lightScheme, setLightScheme] = useState(() => isLightScheme());
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Track light/dark so a near-white glow can fall back to black on light pages.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const update = () => setLightScheme(isLightScheme());
    update();
    mq.addEventListener('change', update);
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', update);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    setIndex(0);
    setInteraction('idle');
  }, [club.id]);

  // Keep the name on one line: recompute the fitted font size whenever the
  // tile width (or viewport breakpoint) changes.
  useEffect(() => {
    const fit = () => {
      const width = buttonRef.current?.clientWidth ?? 0;
      setNamePx(fitNameFont(club.name, width));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [club.name]);

  // Dragging the row cancels any per-tile press / hover visual.
  useEffect(() => {
    if (dragActive) setInteraction('idle');
  }, [dragActive]);

  const id = club.id.padStart(2, '0');
  const candidates = [`/logos/${id}.png`, `/logos/${id}.jpg`, '/logos/no-logo.png'];
  const src = candidates[Math.min(index, candidates.length - 1)];

  const [, main] = club.theme ?? ['#FFC9A6', '#FA803D', '#8A3B0E'];

  const scale = interaction === 'press' ? 'scale(0.94)' : interaction === 'hover' ? 'scale(1.1)' : 'scale(1)';
  const transition =
    interaction === 'press'
      ? 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';

  // Record where the logo currently sits so the preview can fly it into place.
  const handleClick = () => {
    const img = buttonRef.current?.querySelector('img');
    if (img) {
      const r = img.getBoundingClientRect();
      setLogoFlyRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    } else {
      setLogoFlyRect(null);
    }
    onClick(club.id);
  };

  // Only an almost-white glow (e.g. #f0f0f0 … #ffffff) is invisible on a light
  // page and would look odd in colour, so draw just those as black. Anything
  // with a real hue (yellows, etc.) keeps its own colour.
  const glowColor = lightScheme && luminance(main) > 0.85 ? '#000000' : main;

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onPointerEnter={() => {
        if (!dragActive) setInteraction((i) => (i === 'press' ? i : 'hover'));
      }}
      onPointerDown={() => {
        if (!dragActive) setInteraction('press');
      }}
      onPointerUp={() => setInteraction('hover')}
      onPointerLeave={() => setInteraction('idle')}
      onPointerCancel={() => setInteraction('idle')}
      className={`group relative flex h-full w-full cursor-pointer select-none flex-col items-center hover:z-30 ${
        gallery ? 'pt-6' : 'pt-3'
      }`}
      aria-label={club.name}
      title={club.name}
    >
      <div className="flex w-full items-center justify-center gap-1.5">
        {club.rating && (
          <img
            src={asset(club.rating === 'five-star' ? 'icons/five-star-club.png' : 'icons/good-club.png')}
            alt=""
            className="h-[1.05em] w-auto shrink-0 object-contain"
            style={{ fontSize: namePx }}
          />
        )}
        <span
          className="font-semibold text-home-head"
          style={{ fontSize: namePx, lineHeight: 1.2, whiteSpace: 'nowrap' }}
        >
          {club.name}
        </span>
      </div>

      {/* Logo sits inside a fixed box whose centre is the same line for every
          tile, so logos of any aspect ratio are centre-aligned horizontally.
          The name above stays at the very top. Only the logo scales, from its
          own centre. */}
      <img
        src={asset(src)}
        alt=""
        loading="lazy"
        draggable={false}
        className="absolute left-0 top-[52px] z-10 h-[104px] w-full select-none object-contain will-change-transform sm:top-[64px] sm:h-[132px]"
        style={{ transform: scale, transformOrigin: 'center', transition }}
        onError={() => setIndex((i) => i + 1)}
      />

      {/* Elliptical under-glow below the logo — a wide, flat ellipse in the
          club's theme color, brightest under the logo and fading down and out.
          Bottom-anchored so every glow in a row shares the same absolute
          height regardless of logo aspect ratio. Wider than the cell so
          adjacent glows overlap into one continuous band (no dark seam). */}
      <div
        className={`pointer-events-none absolute bottom-1 left-1/2 rounded-[50%] -translate-x-1/2 ${
          lightScheme ? 'h-[44px] w-[128%] sm:h-[76px]' : 'h-[42px] w-[112%] sm:h-[68px]'
        }`}
        style={{
          background: lightScheme
            ? `radial-gradient(50% 50% at 50% 50%, ${glowColor}66, ${glowColor}33 55%, transparent 82%)`
            : `radial-gradient(50% 50% at 50% 50%, ${glowColor}55, ${glowColor}24 55%, transparent 82%)`,
        }}
      />
    </button>
  );
}
