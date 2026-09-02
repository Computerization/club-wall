import ClubLogoItem from './ClubLogoItem';
import type { Club } from '../data/clubs';

interface ClubListProps {
  clubs: Club[];
  onClubClick: (id: string) => void;
}

/**
 * Responsive gallery grid — used for search results and the 五星/优秀社团
 * views. Uses the same logo + under-glow tiles as the homepage rows.
 */
export default function ClubList({ clubs, onClubClick }: ClubListProps) {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
        {clubs.map((club) => (
          <div key={club.id} className="aspect-square animate-fade-up">
            <ClubLogoItem club={club} onClick={onClubClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
