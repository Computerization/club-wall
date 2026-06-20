import Header from '../components/Header';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';
import { useClubNavigation } from '../hooks/useClub';
import { categories, clubs } from '../data/clubs';

export default function Home() {
  const { goToClub } = useClubNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {categories.map((category) => {
          const categoryClubs = clubs.filter((club) => club.category === category);
          return (
            <CategorySection
              key={category}
              category={category}
              clubs={categoryClubs}
              onClubClick={goToClub}
            />
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
