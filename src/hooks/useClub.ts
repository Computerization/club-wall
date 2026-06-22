import { clubs, Club } from '../data/clubs';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Look up a single club by id.
 */
export function useClub(id: string | undefined): Club | undefined {
  return clubs.find((club) => club.id === id);
}

/**
 * Navigation helpers for moving between the wall and club detail pages.
 */
export function useClubNavigation() {
  const navigate = useNavigate();

  return {
    goToClub: (id: string) => navigate(`/club/${id}`),
    goHome: () => navigate('/'),
  };
}

/**
 * Read the club id from the current route's URL params.
 */
export function useClubIdParam(): string | undefined {
  const { id } = useParams<{ id: string }>();
  return id;
}
