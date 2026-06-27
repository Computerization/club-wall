import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../data/clubs';
import { activities } from '../data/activities';
import type { Activity } from '../data/activities';
import useActivityTheme from '../hooks/useActivityTheme';

const AUTO_INTERVAL = 5000;

function ActivitySlide({
  activity,
  onClick,
}: {
  activity: Activity;
  onClick: (id: string) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
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
    <button
      onClick={() => onClick(activity.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl text-left
                 ring-1 ring-white/10 transition-shadow duration-300
                 focus-visible:outline-none focus-visible:ring-2"
      style={{
        aspectRatio: '16 / 9',
        boxShadow: hovered
          ? `0 0 32px ${activity.color}44`
          : '0 30px 70px -25px rgba(0,0,0,0.85)',
      } as React.CSSProperties}
      aria-label={`查看活动：${activity.title}`}
    >
      {/* Placeholder shimmer */}
      {!imgLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700 bg-[length:200%_100%]" />
      )}

      <img
        ref={imgRef}
        src={asset(activity.image)}
        alt={activity.title}
        loading="lazy"
        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
          {activity.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-white/70 sm:text-base">
          {activity.shortDesc}
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
          style={{ backgroundColor: `${activity.color}99` }}
        >
          <Clock className="h-3 w-3" />
          {activity.clubName}
        </span>
      </div>
    </button>
  );
}

export default function UpcomingActivities() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const total = activities.length;

  const currentActivity = activities[current];
  useActivityTheme(currentActivity, sectionRef);

  const goTo = useCallback(
    (index: number) => {
      const target = ((index % total) + total) % total;
      setCurrent(target);
      const el = containerRef.current;
      if (!el) return;
      const slide = el.children[target] as HTMLElement;
      if (slide) {
        el.scrollTo({
          left: slide.offsetLeft,
          behavior: 'smooth',
        });
      }
    },
    [total],
  );

  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);
  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Auto-play
  useEffect(() => {
    if (isPaused || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext, total]);

  // Sync scroll-based index (for touch/swipe)
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== current && index >= 0 && index < total) {
      setCurrent(index);
    }
  }, [current, total]);

  const handleSlideClick = useCallback(
    (id: string) => {
      navigate(`/activity/${id}`);
    },
    [navigate],
  );

  if (total === 0) return null;

  return (
    <section ref={sectionRef} className="py-14">
      {/* Section header */}
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between px-6">
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

      {/* Carousel */}
      <div
        className="group relative mx-auto max-w-7xl px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides track */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain rounded-2xl"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="w-full shrink-0 snap-start"
              style={{ flex: '0 0 100%' }}
            >
              <ActivitySlide activity={activity} onClick={handleSlideClick} />
            </div>
          ))}
        </div>

        {/* Prev button */}
        <button
          onClick={goPrev}
          className="absolute left-9 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center
                     rounded-full glass-strong text-white opacity-0 shadow-lg transition-all duration-300
                     hover:scale-110 hover:bg-white/20 group-hover:opacity-100
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
          aria-label="上一张"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next button */}
        <button
          onClick={goNext}
          className="absolute right-9 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center
                     rounded-full glass-strong text-white opacity-0 shadow-lg transition-all duration-300
                     hover:scale-110 hover:bg-white/20 group-hover:opacity-100
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
          aria-label="下一张"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              onClick={() => goTo(index)}
              className="rounded-full transition-all duration-300"
              style={
                index === current
                  ? { height: 10, width: 32, backgroundColor: activity.color }
                  : { height: 10, width: 10, backgroundColor: 'rgba(255,255,255,0.25)' }
              }
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>

        {isPaused && activities[current].id !== 'L1' && (
          <div className="absolute right-12 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
            已暂停
          </div>
        )}
        {activities[current].id === 'L1' && (
          <div
            className="absolute right-12 top-4 z-10 rounded-full px-3 py-1 text-xs text-white backdrop-blur-sm"
            style={{ backgroundColor: `${activities[current].color}cc` }}
          >
            招募中
          </div>
        )}
      </div>
    </section>
  );
}