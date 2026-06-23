import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Club } from '../data/clubs';
import { getCategoryMeta } from '../data/categoryMeta';
import GalleryCard from './GalleryCard';

// ============== Tuning constants ==============
// Desktop poster tiles are square; on narrow phones we switch to a smaller,
// portrait card so more than one is visible at a time in the marquee.
const CARD_WIDTH = 340;
const CARD_HEIGHT = 340;
const MOBILE_CARD_WIDTH = 220;
const MOBILE_CARD_HEIGHT = 300;
const MOBILE_BREAKPOINT = '(max-width: 639px)';
const CARD_GAP = 20;
const SCROLL_MULTIPLIER = 1.5;
const MOVE_THRESHOLD = 5;
const SET_COUNT = 3;
const AUTO_SCROLL_PIXELS_PER_FRAME = 0.55;
const RESUME_DELAY_MS = 5000;

interface CategorySectionProps {
  category: string;
  clubs: Club[];
  onClubClick: (id: string) => void;
  rowIndex?: number;
  disableAutoScroll?: boolean;
}

export default function CategorySection({ category, clubs, onClubClick, rowIndex = 0, disableAutoScroll = false }: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Card dimensions drive both the rendered tile size and the seamless-loop
  // math, so they're a single reactive source shrunk on narrow phones.
  const [card, setCard] = useState({ w: CARD_WIDTH, h: CARD_HEIGHT });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const autoScrollEnabled = useRef(true);
  const isMobile = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchMoved = useRef(false);

  const meta = getCategoryMeta(category);

  // Direction: even rows scroll right-to-left (-1), odd rows left-to-right (1).
  const direction = useMemo(() => rowIndex % 2 === 0 ? -1 : 1, [rowIndex]);

  const setWidth = useMemo(() => clubs.length * card.w + (clubs.length - 1) * CARD_GAP, [clubs, card.w]);
  const middleStart = setWidth;
  const middleEnd = 2 * setWidth;

  // Detect touch / mobile devices.
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }, []);

  // Swap to the compact portrait card on narrow viewports.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () =>
      setCard(mq.matches
        ? { w: MOBILE_CARD_WIDTH, h: MOBILE_CARD_HEIGHT }
        : { w: CARD_WIDTH, h: CARD_HEIGHT });
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // When auto-scroll is disabled, keep it permanently off.
  useEffect(() => {
    if (disableAutoScroll) {
      autoScrollEnabled.current = false;
    }
  }, [disableAutoScroll]);

  // Initialize the scroll position + run the auto-scroll animation (unless disabled).
  useEffect(() => {
    if (clubs.length === 0 || disableAutoScroll) return;

    if (containerRef.current) {
      containerRef.current.scrollLeft = middleStart;
    }

    let rafId: number;
    const animate = () => {
      if (containerRef.current && autoScrollEnabled.current) {
        const el = containerRef.current;
        let newPos = el.scrollLeft + direction * AUTO_SCROLL_PIXELS_PER_FRAME;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (direction > 0 && newPos >= middleEnd) {
          newPos -= setWidth;
        } else if (direction < 0 && newPos < middleStart) {
          newPos += setWidth;
        }

        newPos = Math.max(0, Math.min(newPos, maxScroll));
        el.scrollLeft = newPos;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [direction, clubs.length, middleStart, setWidth, middleEnd, disableAutoScroll]);

  // Snap back across the seam when the user scrolls past a copy boundary.
  const handleScroll = useCallback(() => {
    if (!containerRef.current || clubs.length === 0 || autoScrollEnabled.current) return;

    const cur = containerRef.current.scrollLeft;
    if (cur >= middleEnd) {
      containerRef.current.scrollLeft = cur - setWidth;
    } else if (cur < middleStart) {
      containerRef.current.scrollLeft = cur + setWidth;
    }
  }, [setWidth, middleStart, middleEnd, clubs.length]);

  // Desktop: pause auto-scroll on hover.
  const handleMouseEnter = useCallback(() => {
    if (!isMobile.current) {
      autoScrollEnabled.current = false;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (!isMobile.current && !disableAutoScroll) {
      autoScrollEnabled.current = true;
    }
  }, [disableAutoScroll]);

  // Mobile: pause on touch, then resume after a delay.
  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const startResumeTimer = useCallback(() => {
    if (disableAutoScroll) return;
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      autoScrollEnabled.current = true;
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, disableAutoScroll]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchMoved.current = false;
    autoScrollEnabled.current = false;
    clearResumeTimer();
  }, [clearResumeTimer]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    if (dx > MOVE_THRESHOLD) {
      touchMoved.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (disableAutoScroll) return;
    if (!touchMoved.current) {
      autoScrollEnabled.current = true;
    } else {
      startResumeTimer();
    }
  }, [startResumeTimer, disableAutoScroll]);

  const handleTouchCancel = useCallback(() => {
    clearResumeTimer();
    if (!disableAutoScroll) autoScrollEnabled.current = true;
  }, [clearResumeTimer, disableAutoScroll]);

  // Click-and-drag scrolling.
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * SCROLL_MULTIPLIER;
    if (Math.abs(walk) > MOVE_THRESHOLD) {
      setHasMoved(true);
    }
    containerRef.current.scrollLeft = scrollLeftState - walk;
  }, [isDragging, startX, scrollLeftState]);

  const handleCardClick = useCallback((clubId: string) => {
    if (hasMoved || touchMoved.current) return;
    onClubClick(clubId);
  }, [hasMoved, onClubClick]);

  const scrollByOne = useCallback((dir: 'left' | 'right') => {
    if (!containerRef.current) return;
    const amount = dir === 'left' ? -(card.w + CARD_GAP) : (card.w + CARD_GAP);
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, [card.w]);

  const displayClubs = useMemo(() => {
    if (clubs.length === 0) return [];
    if (disableAutoScroll) return clubs;
    return Array(SET_COUNT).fill(clubs).flat();
  }, [clubs, disableAutoScroll]);

  if (clubs.length === 0) return null;

  return (
    <section id={`cat-${category}`} className="group relative scroll-mt-20 py-10">
      {/* Section header */}
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between px-6">
        <div>
          <span className="eyebrow text-[11px] font-semibold" style={{ color: meta.accent }}>
            {meta.cn} · {String(clubs.length).padStart(2, '0')}
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            {meta.en}
          </h2>
          <p className="mt-1 text-sm text-white/45">{meta.tagline}</p>
        </div>
        <span
          className="hidden h-12 w-1 rounded-full sm:block"
          style={{ background: `linear-gradient(${meta.accent}, transparent)` }}
        />
      </div>

      {/* Marquee */}
      <div className="relative">
        <button
          onClick={() => scrollByOne('left')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center
                     rounded-full glass-strong text-white opacity-0 shadow-lg transition-all duration-300
                     hover:scale-110 group-hover:opacity-100"
          aria-label="向左滑动"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={containerRef}
          className="marquee-mask scrollbar-hide select-none overflow-x-auto px-6"
          style={{
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            touchAction: 'pan-x',
          }}
          onScroll={handleScroll}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div className={`flex gap-5 py-2 ${disableAutoScroll ? 'w-full flex-wrap justify-center' : 'w-max'}`}>
            {displayClubs.map((club, index) => (
              <div
                key={`${club.id}-${index}`}
                style={{ width: card.w, height: card.h }}
                className="shrink-0"
              >
                <GalleryCard club={club} onClick={handleCardClick} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollByOne('right')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center
                     rounded-full glass-strong text-white opacity-0 shadow-lg transition-all duration-300
                     hover:scale-110 group-hover:opacity-100"
          aria-label="向右滑动"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
