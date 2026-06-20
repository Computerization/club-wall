import { clubs, Club, Category } from '../data/clubs';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * 根据分类筛选社团
 */
export function useFilteredClubs(category: Category | 'All'): Club[] {
  if (category === 'All') {
    return clubs;
  }
  return clubs.filter((club) => club.category === category);
}

/**
 * 根据ID获取单个社团
 */
export function useClub(id: string | undefined): Club | undefined {
  return clubs.find((club) => club.id === id);
}

/**
 * 社团导航
 */
export function useClubNavigation() {
  const navigate = useNavigate();

  return {
    goToClub: (id: string) => navigate(`/club/${id}`),
    goHome: () => navigate('/'),
  };
}

/**
 * 获取URL中的社团ID参数
 */
export function useClubIdParam(): string | undefined {
  const { id } = useParams<{ id: string }>();
  return id;
}
