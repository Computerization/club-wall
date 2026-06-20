import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Club, Category } from '../data/clubs';
import { ListCardImage } from './ImageComponents';

// ============== 常量配置 ==============
const CARD_WIDTH = 192;
const CARD_GAP = 16;
const SCROLL_MULTIPLIER = 1.5;
const MOVE_THRESHOLD = 5;
const SET_COUNT = 3;
const AUTO_SCROLL_PIXELS_PER_FRAME = 1.2;
const RESUME_DELAY_MS = 5000;

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

  // 方向：偶数行从右向左(-1)，奇数行从左向右(1)
  const direction = useMemo(() => rowIndex % 2 === 0 ? -1 : 1, [rowIndex]);

  const setWidth = useMemo(() => clubs.length * CARD_WIDTH + (clubs.length - 1) * CARD_GAP, [clubs]);
  const middleStart = setWidth;
  const middleEnd = 2 * setWidth;

  // 检测移动设备
  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }, []);

  // 初始化滚动位置 + 自动滚动动画
  useEffect(() => {
    if (clubs.length === 0) return;

    if (containerRef.current) {
      containerRef.current.scrollLeft = middleStart;
    }

    let rafId: number;
    const animate = () => {
      if (containerRef.current && autoScrollEnabled.current) {
        const el = containerRef.current;
        let newPos = el.scrollLeft + direction * AUTO_SCROLL_PIXELS_PER_FRAME;
        const maxScroll = el.scrollWidth - el.clientWidth;

        // 无限滚动边界处理
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
  }, [direction, clubs.length, middleStart, setWidth, middleEnd]);

  // 用户滚动时的边界吸附
  const handleScroll = useCallback(() => {
    if (!containerRef.current || clubs.length === 0 || autoScrollEnabled.current) return;

    const cur = containerRef.current.scrollLeft;
    if (cur >= middleEnd) {
      containerRef.current.scrollLeft = cur - setWidth;
    } else if (cur < middleStart) {
      containerRef.current.scrollLeft = cur + setWidth;
    }
  }, [setWidth, middleStart, middleEnd, clubs.length]);

  // 桌面端悬停暂停
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

  // 移动端触摸暂停/恢复
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

  // 拖拽滚动
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
    const amount = dir === 'left' ? (CARD_WIDTH + CARD_GAP) : -(CARD_WIDTH + CARD_GAP);
    containerRef.current.scrollBy({ left: amount });
  }, []);

  const tripledClubs = useMemo(() => {
    if (clubs.length === 0) return [];
    return Array(SET_COUNT).fill(clubs).flat();
  }, [clubs]);

  if (clubs.length === 0) return null;

  return (
    <section className="py-6 px-6 border-b border-gray-100 last:border-b-0 relative group">
      <h2 className="text-xl font-bold text-[#1A5F4A] mb-4">{category}</h2>
      <div className="relative">
        <button
          onClick={() => scrollByOne('left')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
          style={{
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            touchAction: 'pan-x'
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
          <div className="flex gap-4 w-max">
            {tripledClubs.map((club, index) => (
              <ListCard
                key={`${club.id}-${index}`}
                club={club}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollByOne('right')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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

// ============== 子组件 ==============

interface ListCardProps {
  club: Club;
  onClick: (id: string) => void;
}

function ListCard({ club, onClick }: ListCardProps) {
  return (
    <div
      onClick={() => onClick(club.id)}
      className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 
                 border border-gray-100"
    >
      <ListCardImage club={club} />
      <CardContent club={club} />
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
