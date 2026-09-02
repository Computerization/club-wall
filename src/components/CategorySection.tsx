import { useEffect, useMemo, useRef, useState } from 'react';
import type { Club } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';
import { darken, useLightScheme } from '../lib/theme';
import ClubLogoItem from './ClubLogoItem';

// ============== Tuning constants ==============
const CARD_WIDTH = 210;
const CARD_HEIGHT = 260;
const MOBILE_CARD_WIDTH = 160;
const MOBILE_CARD_HEIGHT = 200;
const LOGO_GAP = 21;
const MOBILE_LOGO_GAP = 17;
const MOBILE_BREAKPOINT = '(max-width: 639px)';
const MOVE_THRESHOLD = 5;
const SET_COUNT = 3;

/** Cruise (auto-scroll) speed, px/s. */
const NORMAL_PX_S = 33;
/** Exponential friction rate (higher = settles faster), mirroring the hero drag. */
const FRICTION = 2;
/** A release slower than this is treated as "let go while still". */
const ZERO_SPEED_PX_S = 25;
/** Cap on the thrown velocity, px/s. */
const MAX_THROW_PX_S = 900;
/** Pause before ramping back up after a zero-speed release. */
const RESUME_DELAY_MS = 1500;

interface CategorySectionProps {
  category: string;
  clubs: Club[];
  onClubClick: (id: string) => void;
  rowIndex?: number;
  disableAutoScroll?: boolean;
  /** Render as a wrapping responsive grid that tiles downward instead of a
   *  horizontal marquee. Disables all scroll/auto-scroll machinery. */
  tiled?: boolean;
}

export default function CategorySection({ category, clubs, onClubClick, rowIndex = 0, disableAutoScroll = false, tiled = false }: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState({ w: CARD_WIDTH, h: CARD_HEIGHT, gap: LOGO_GAP });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const meta = getCategoryMeta(category);
  const lightScheme = useLightScheme();
  // Category accents read better when pushed deeper & bolder on light pages.
  const accentColor = lightScheme ? darken(meta.accent, 0.35) : meta.accent;

  // Base marquee direction: even rows cruise (-1), odd rows (+).
  const direction = useMemo(() => (rowIndex % 2 === 0 ? -1 : 1), [rowIndex]);

  const cellWidth = card.w + card.gap * 2;
  const setWidth = useMemo(() => clubs.length * cellWidth, [clubs, cellWidth]);
  const middleStart = setWidth;
  const middleEnd = 2 * setWidth;

  // ---------- motion state (refs so rAF + native listeners always see latest) ----------
  const enabledRef = useRef(true);          // motion engine on/off
  const pressedRef = useRef(false);         // pointer held down
  const dirRef = useRef(direction);         // cruise direction (±1)
  const velRef = useRef(direction * NORMAL_PX_S); // signed velocity, px/s
  const lastTsRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchorXRef = useRef(0);
  const anchorScrollRef = useRef(0);
  const samplesRef = useRef<{ t: number; left: number }[]>([]);

  // Swap to the compact card on narrow viewports.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () =>
      setCard(mq.matches
        ? { w: MOBILE_CARD_WIDTH, h: MOBILE_CARD_HEIGHT, gap: MOBILE_LOGO_GAP }
        : { w: CARD_WIDTH, h: CARD_HEIGHT, gap: LOGO_GAP });
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Static rows never move.
  useEffect(() => {
    if (disableAutoScroll) enabledRef.current = false;
  }, [disableAutoScroll]);

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  // ---------- motion engine: auto-cruise + throw glide ----------
  // velocity eases exponentially toward the cruise speed (target) — friction
  // when faster, ramp-up when slower — in the current direction.
  useEffect(() => {
    if (clubs.length === 0 || disableAutoScroll || tiled) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollLeft = middleStart;
    lastTsRef.current = 0;

    let rafId = 0;
    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);
      const now = containerRef.current;
      if (!now) return;
      if (pressedRef.current || !enabledRef.current) {
        lastTsRef.current = ts;
        return;
      }
      if (!lastTsRef.current) {
        lastTsRef.current = ts;
        return;
      }
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const target = dirRef.current * NORMAL_PX_S;
      const k = Math.exp(-FRICTION * dt);
      const v = target + (velRef.current - target) * k;
      velRef.current = v;

      let pos = now.scrollLeft + v * dt;
      while (pos >= middleEnd) pos -= setWidth;
      while (pos < middleStart) pos += setWidth;
      pos = Math.max(0, Math.min(pos, now.scrollWidth - now.clientWidth));
      now.scrollLeft = pos;
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [clubs.length, middleStart, middleEnd, setWidth, disableAutoScroll, tiled]);

  // ---------- pointer drag (mirrors the hero title drag) ----------
  useEffect(() => {
    const el = containerRef.current;
    if (!el || disableAutoScroll || tiled) return;

    function throwVelocity(samples: { t: number; left: number }[]) {
      const n = samples.length;
      if (n < 2) return 0;
      const last = samples[n - 1];
      let prev = samples[n - 2];
      for (let i = n - 2; i >= 0; i--) {
        if (last.t - samples[i].t >= 80) {
          prev = samples[i];
          break;
        }
      }
      const dt = (last.t - prev.t) / 1000;
      if (dt <= 0) return 0;
      let v = (last.left - prev.left) / dt;
      if (Math.abs(v) > MAX_THROW_PX_S) v = Math.sign(v) * MAX_THROW_PX_S;
      return v;
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      clearResumeTimer();
      enabledRef.current = false;
      pressedRef.current = true;
      setIsDragging(true);
      setHasMoved(false);
      anchorXRef.current = e.clientX;
      anchorScrollRef.current = el.scrollLeft;
      samplesRef.current = [{ t: Date.now(), left: el.scrollLeft }];

      const onMove = (ev: PointerEvent) => {
        if (!pressedRef.current) return;
        const dx = ev.clientX - anchorXRef.current;
        if (Math.abs(dx) > MOVE_THRESHOLD) setHasMoved(true);
        const now = containerRef.current;
        if (now) now.scrollLeft = anchorScrollRef.current - dx;

        const t = Date.now();
        const s = samplesRef.current;
        s.push({ t, left: now ? now.scrollLeft : anchorScrollRef.current - dx });
        if (s.length > 12) s.shift();
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (!pressedRef.current) return;
        pressedRef.current = false;
        setIsDragging(false);

        const v = throwVelocity(samplesRef.current);
        samplesRef.current = [];
        if (Math.abs(v) < ZERO_SPEED_PX_S) {
          // released at rest: wait, then cruise up in the original direction
          dirRef.current = direction;
          velRef.current = 0;
          enabledRef.current = false;
          resumeTimerRef.current = setTimeout(() => {
            enabledRef.current = true;
          }, RESUME_DELAY_MS);
        } else {
          // throw: glide in the release direction, easing down to cruise speed
          dirRef.current = v > 0 ? 1 : -1;
          velRef.current = v;
          enabledRef.current = true;
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    el.addEventListener('pointerdown', onDown);
    return () => {
      el.removeEventListener('pointerdown', onDown);
    };
  }, [clubs.length, disableAutoScroll, tiled, direction, middleStart, middleEnd, setWidth]);

  // ---------- touch: pause auto-scroll while swiping natively ----------
  useEffect(() => {
    const el = containerRef.current;
    if (!el || disableAutoScroll || tiled) return;
    const onTouchStart = () => {
      clearResumeTimer();
      enabledRef.current = false;
      velRef.current = 0;
    };
    const onTouchEnd = () => {
      dirRef.current = direction;
      velRef.current = 0;
      enabledRef.current = false;
      resumeTimerRef.current = setTimeout(() => {
        enabledRef.current = true;
      }, RESUME_DELAY_MS);
    };
    const onTouchCancel = () => {
      clearResumeTimer();
      dirRef.current = direction;
      velRef.current = 0;
      enabledRef.current = true;
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchCancel);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [disableAutoScroll, tiled, direction]);

  const handleCardClick = (clubId: string) => {
    if (hasMoved) return;
    onClubClick(clubId);
  };

  const displayClubs = useMemo(() => {
    if (clubs.length === 0) return [];
    if (disableAutoScroll) return clubs;
    return Array(SET_COUNT).fill(clubs).flat();
  }, [clubs, disableAutoScroll]);

  if (clubs.length === 0) return null;

  return (
    <section id={`cat-${category}`} className="group relative scroll-mt-20 py-6">
      {/* Section header */}
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between px-6">
        <div>
          <h2 className="mt-1 font-display text-3xl font-bold text-home-head sm:text-4xl">
            <span className="font-extrabold" style={{ color: accentColor }}>{meta.cn}</span> {meta.en}
            <span className="ml-3 align-middle text-2xl font-medium text-home-mut sm:text-3xl">
              × {clubs.length}
            </span>
          </h2>
          <p className="mt-1 text-sm text-home-mut">{meta.tagline}</p>
        </div>
        <span
          className="hidden h-12 w-1 rounded-full sm:block"
          style={{ background: `linear-gradient(${meta.accent}, transparent)` }}
        />
      </div>

      {/* Tiled grid: logos wrap and stack downward, no scrolling. */}
      {tiled ? (
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6">
            {clubs.map((club) => (
              <div key={club.id} className="aspect-square">
                <ClubLogoItem club={club} onClick={onClubClick} gallery />
              </div>
            ))}
          </div>
        </div>
      ) : (
      /* Marquee */
      <div className="relative">
        <div
          ref={containerRef}
          className="marquee-mask scrollbar-hide select-none overflow-x-auto px-6"
          style={{
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            touchAction: 'pan-x',
          }}
        >
          <div className={`flex items-center py-6 w-max ${disableAutoScroll ? 'mx-auto' : ''}`}>
            {displayClubs.map((club, index) => (
              <div
                key={`${club.id}-${index}`}
                className="shrink-0"
                style={{ width: card.w, height: card.h, marginLeft: card.gap, marginRight: card.gap }}
              >
                <ClubLogoItem club={club} onClick={handleCardClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
