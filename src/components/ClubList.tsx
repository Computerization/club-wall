import GalleryCard from './GalleryCard';
import type { Club } from '../data/clubs';

interface ClubListProps {
  clubs: Club[];
  onClubClick: (id: string) => void;
}

/**
 * Responsive gallery grid — used for search results. Reuses the same immersive
 * tile as the marquee rows so the whole site reads as one curated wall.
 */
export default function ClubList({ clubs, onClubClick }: ClubListProps) {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {clubs.map((club) => (
          <div key={club.id} className="h-[300px] animate-fade-up">
            <GalleryCard club={club} onClick={onClubClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
