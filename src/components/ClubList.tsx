import ClubCard from './ClubCard';
import type { Club } from '../data/clubs';

interface ClubListProps {
  clubs: Club[];
  onClubClick: (id: string) => void;
}

/**
 * 社团列表网格组件
 */
export default function ClubList({ clubs, onClubClick }: ClubListProps) {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} onClick={onClubClick} />
          ))}
        </div>
      </div>
    </section>
  );
}
