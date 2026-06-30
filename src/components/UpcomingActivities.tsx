import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../data/clubs';
import { activities } from '../data/activities';
import type { Activity } from '../data/activities';

// ============== Tuning constants ==============
const CARD_WIDTH = 320;
const CARD_HEIGHT = 180;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_HEIGHT = 135;
const MOBILE_BREAKPOINT = '(max-width: 639px)';
const CARD_GAP = 20;
const MIN_COPY_COUNT = 3;
const AUTO_SCROLL_PIXELS_PER_FRAME = 0.55;
const RESUME_DELAY_MS = 5000;
const MOVE_THRESHOLD = 5;
const SCROLL_MULTIPLIER = 1.5;

function ActivityCard({
  activity,
  onClick,
}: {
  activity: Activity;
  onClick: (id: string) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setImgLoaded(true);
      return;
    }
    const onLoad = () => setImgLoaded(true);
    img.addEventListener('load', onLoad, { once: true });
    return () => img.removeEventListener('load', onLoad);
  }, [activity.image]);

  return (
    <article
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl
                 bg-ink-800 shadow-card ring-1 ring-white/10 transition-all duration-500
                 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-lift"
      onClick={() => onClick(activity.id)}
      style={{ ['--accent' as string]: activity.color }}
    >
      {!imgLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700 bg-[length:200%_100%]" />
      )}

      <img
        ref={imgRef}
        src={asset(activity.image)}
        alt={activity.title}
        loading="lazy"
        draggable={false}
        className={`absolute inset-0 h-full w-full object-cover transition-transform
                   duration-700 ease-out group-hover:scale-110 ${
                     imgLoaded ? 'opacity-100' : 'opacity-0'
                   }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1.5px var(--accent), 0 24px 60px -20px var(--accent)' }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-3">
        <h3 className="font-display text-base font-semibold leading-tight text-white drop-shadow-sm">
          {activity.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/65">
          {activity.shortDesc}
        </p>
        <span
          className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
          style={{ backgroundColor: `${activity.color}99` }}
        >
          <Clock className="h-2.5 w-2.5" />
          {activity.clubName}
        </span>
      </div>
    </article>
  );
}

export default function UpcomingActivities({ tiled = false }: { tiled?: boolean }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const total = activities.length;

  const setWidth = useMemo(() => total * card.w + (total - 1) * CARD_GAP, [total, card.w]);

  // Dynamically compute how many copies are needed so the loop seam is always
  // beyond the visible viewport. With fewer cards the set is narrower, so we
  // need more copies to keep the scrollable area wide enough.
  const copyCount = useMemo(() => {
    if (setWidth === 0) return MIN_COPY_COUNT;
    const vw = window.innerWidth;
    const needed = Math.ceil(2 + vw / setWidth);
    return Math.max(MIN_COPY_COUNT, needed);
  }, [setWidth]);

  const middleStart = setWidth;
  const middleEnd = 2 * setWidth;

  // Detect touch / mobile devices.
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }, []);

  // Swap to compact card on narrow viewports.
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

  // Initialize the scroll position + run the auto-scroll animation.
  useEffect(() => {
    if (total === 0 || tiled) return;

    if (containerRef.current) {
      containerRef.current.scrollLeft = middleStart;
    }

    let rafId: number;
    const animate = () => {
      if (containerRef.current && autoScrollEnabled.current) {
        const el = containerRef.current;
        let newPos = el.scrollLeft - AUTO_SCROLL_PIXELS_PER_FRAME;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (newPos < middleStart) {
          newPos += setWidth;
        }

        newPos = Math.max(0, Math.min(newPos, maxScroll));
        el.scrollLeft = newPos;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [total, middleStart, setWidth, middleEnd, tiled, copyCount]);

  // Snap back across the seam when the user scrolls past a copy boundary.
  const handleScroll = useCallback(() => {
    if (!containerRef.current || total === 0 || autoScrollEnabled.current) return;

    const cur = containerRef.current.scrollLeft;
    if (cur >= middleEnd) {
      containerRef.current.scrollLeft = cur - setWidth;
    } else if (cur < middleStart) {
      containerRef.current.scrollLeft = cur + setWidth;
    }
  }, [setWidth, middleStart, middleEnd, total]);

  // Desktop: pause auto-scroll on hover.
  const handleMouseEnter = useCallback(() => {
    if (!isMobile.current) {
      autoScrollEnabled.current = false;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (!isMobile.current) {
      autoScrollEnabled.current = true;
    }
  }, []);

  // Mobile: pause on touch, then resume after a delay.
  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const startResumeTimer = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      autoScrollEnabled.current = true;
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

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
    if (!touchMoved.current) {
      autoScrollEnabled.current = true;
    } else {
      startResumeTimer();
    }
  }, [startResumeTimer]);

  const handleTouchCancel = useCallback(() => {
    clearResumeTimer();
    autoScrollEnabled.current = true;
  }, [clearResumeTimer]);

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

  const handleCardClick = useCallback((activityId: string) => {
    if (hasMoved || touchMoved.current) return;
    navigate(`/activity/${activityId}`);
  }, [hasMoved, navigate]);

  const displayActivities = useMemo(() => {
    if (total === 0) return [];
    return Array(copyCount).fill(activities).flat();
  }, [total, copyCount]);

  if (total === 0) return null;

  return (
    <section className="group relative py-14">
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between px-6">
        <div>
          <span className="eyebrow text-[11px] font-semibold" style={{ color: 'var(--theme-light)', transition: 'color 0.6s ease' }}>
            活动 · {String(total).padStart(2, '0')}
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            Upcoming Activities
          </h2>
          <p className="mt-1 text-sm text-white/45">近期即将举行的社团活动</p>
        </div>
        <span className="hidden h-12 w-1 rounded-full sm:block" style={{ background: 'linear-gradient(var(--theme-light), transparent)', transition: '--theme-light 0.6s ease' }} />
      </div>

      {/* Tiled grid: cards wrap and stack downward, no scrolling. */}
      {tiled ? (
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {activities.map((activity) => (
              <div key={activity.id} style={{ aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}` }}>
                <ActivityCard activity={activity} onClick={handleCardClick} />
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
          <div className="flex gap-5 py-2 w-max">
            {displayActivities.map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                style={{ width: card.w, height: card.h }}
                className="shrink-0"
              >
                <ActivityCard activity={activity} onClick={handleCardClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}