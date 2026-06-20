import { useCallback, useRef, useState, useMemo } from 'react';
import type { Club, Category } from '../data/clubs';

const CARD_WIDTH = 192;
const CARD_GAP = 16;
const DRAG_MULTIPLIER = 1.5;
const MOVE_THRESHOLD = 5;
const DUPLICATE_COUNT = 10;

interface CategorySectionProps {
  category: Category;
  clubs: Club[];
  onClubClick: (id: string) => void;
}

export default function CategorySection({ category, clubs, onClubClick }: CategorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
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
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCardClick = useCallback((clubId: string) => {
    if (hasMoved) return;
    onClubClick(clubId);
  }, [hasMoved, onClubClick]);

  const duplicatedClubs = useMemo(() => {
    return Array(DUPLICATE_COUNT).fill(clubs).flat();
  }, [clubs]);

  const cursorStyle = isDragging ? 'grabbing' : 'grab';

  return (
    <section className="py-6 px-6 border-b border-gray-100 last:border-b-0">
      <h2 className="text-xl font-bold text-[#1A5F4A] mb-4">{category}</h2>
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide select-none"
        style={{ userSelect: 'none', cursor: cursorStyle }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-4 w-max">
          {duplicatedClubs.map((club, index) => (
            <ClubCard
              key={`${club.id}-${index}`}
              club={club}
              onClick={handleCardClick}
            />
          ))}
        </div>
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
