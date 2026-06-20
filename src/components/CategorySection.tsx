import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Club, Category } from '../data/clubs';

const CARD_WIDTH = 192;
const CARD_GAP = 16;
const DRAG_MULTIPLIER = 1.5;
const MOVE_THRESHOLD = 5;
const TOTAL_SETS = 3;
const AUTO_SCROLL_SPEED = 1.2;
const RESUME_DELAY = 5000;

interface CategorySectionProps {
  category: Category;
  clubs: Club[];
  onClubClick: (id: string) => void;
  rowIndex: number;
}

export default function CategorySection({ category, clubs, onClubClick, rowIndex }: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const autoScrollEnabled = useRef(true);
  const isMobile = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchMoved = useRef(false);

  // Direction: even rows (left→right): -1, odd rows (right→left): 1
  const direction = useMemo(() => rowIndex % 2 === 0 ? -1 : 1, [rowIndex]);

  const setWidth = useMemo(() => clubs.length * CARD_WIDTH + (clubs.length - 1) * CARD_GAP, [clubs]);
  const middleStart = setWidth;
  const middleEnd = 2 * setWidth;

  // Detect mobile once
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches ||
                       'ontouchstart' in window;
  }, []);

  // Initialize scroll position + auto-scroll animation loop with built-in boundary snap
  useEffect(() => {
    if (clubs.length === 0) return;
    // Initialize to middle set
    if (containerRef.current) {
      containerRef.current.scrollLeft = middleStart;
    }
    let rafId: number;
    const animate = () => {
      if (containerRef.current && autoScrollEnabled.current) {
        const el = containerRef.current;
        let newPos = el.scrollLeft + direction * AUTO_SCROLL_SPEED;
        const maxScroll = el.scrollWidth - el.clientWidth;
        // Infinite scroll boundary snap (handled here, not in scroll event)
        if (direction > 0 && newPos >= middleEnd) {
          newPos -= setWidth;
        } else if (direction < 0 && newPos < middleStart) {
          newPos += setWidth;
        }
        // Clamp to prevent getting stuck at edges
        newPos = Math.max(0, Math.min(newPos, maxScroll));
        el.scrollLeft = newPos;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [direction, clubs.length, middleStart, setWidth, middleEnd]);

  // --- Infinite scroll boundary snap (only for user-initiated scroll) ---
  const handleScroll = useCallback(() => {
    if (!containerRef.current || clubs.length === 0) return;
    // During auto-scroll, snap is handled in the animation loop — skip here
    if (autoScrollEnabled.current) return;
    const cur = containerRef.current.scrollLeft;
    if (cur >= middleEnd) {
      containerRef.current.scrollLeft = cur - setWidth;
    } else if (cur < middleStart) {
      containerRef.current.scrollLeft = cur + setWidth;
    }
  }, [setWidth, middleStart, middleEnd, clubs.length]);

  // --- Desktop hover pause/resume ---
  const handleMouseEnter = useCallback(() => {
    if (isMobile.current) return;
    autoScrollEnabled.current = false;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
    if (isMobile.current) return;
    autoScrollEnabled.current = true;
  }, []);

  // --- Mobile touch pause/resume ---
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
    }, RESUME_DELAY);
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
      // Tap (no drag) — resume auto-scroll immediately
      autoScrollEnabled.current = true;
    } else {
      startResumeTimer();
    }
  }, [startResumeTimer]);

  const handleTouchCancel = useCallback(() => {
    clearResumeTimer();
    autoScrollEnabled.current = true;
  }, [clearResumeTimer]);

  // --- Drag scrolling ---
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
    const walk = (x - startX) * DRAG_MULTIPLIER;
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
    const amount = dir === 'left' ? -(CARD_WIDTH + CARD_GAP) : (CARD_WIDTH + CARD_GAP);
    containerRef.current.scrollBy({ left: amount });
  }, []);

  const tripledClubs = useMemo(() => {
    if (clubs.length === 0) return [];
    return Array(TOTAL_SETS).fill(clubs).flat();
  }, [clubs]);

  const cursorStyle = isDragging ? 'grabbing' : 'grab';

  if (clubs.length === 0) return null;

  return (
    <section className="py-6 px-6 border-b border-gray-100 last:border-b-0 relative group">
      <h2 className="text-xl font-bold text-[#1A5F4A] mb-4">{category}</h2>
      <div className="relative">
        <button
          onClick={() => scrollByOne('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10
                     w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          aria-label="向左滑动"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A5F4A]" />
        </button>

        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-hide select-none"
          style={{ userSelect: 'none', cursor: cursorStyle, scrollbarWidth: 'none', touchAction: 'pan-x' }}
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
          <div className="flex gap-4 w-max">
            {tripledClubs.map((club, index) => (
              <ClubCard
                key={`${club.id}-${index}`}
                club={club}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollByOne('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10
                     w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          aria-label="向右滑动"
        >
          <ChevronRight className="w-5 h-5 text-[#1A5F4A]" />
        </button>
      </div>
    </section>
  );
}

interface ClubCardProps {
  club: Club;
  onClick: (id: string) => void;
}

function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <div
      onClick={() => onClick(club.id)}
      className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 
                 border border-gray-100"
    >
      <CardImage club={club} />
      <CardContent club={club} />
    </div>
  );
}

function CardImage({ club }: { club: Club }) {
  return (
    <div className="h-32 overflow-hidden bg-gray-100">
      {club.poster ? (
        <img src={club.poster} alt={club.name} className="w-full h-full object-cover" />
      ) : (
        <PlaceholderImage clubName={club.name} />
      )}
    </div>
  );
}

function PlaceholderImage({ clubName }: { clubName: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      {clubName}
    </div>
  );
}

function CardContent({ club }: { club: Club }) {
  return (
    <div className="p-3">
      <h3 className="text-base font-bold text-[#1A5F4A] truncate">{club.name}</h3>
      <p className="text-gray-500 text-xs truncate">{club.shortDesc}</p>
    </div>
  );
}