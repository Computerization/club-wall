import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';
import ClubList from '../components/ClubList';
import { useClubNavigation } from '../hooks/useClub';
import { categories, clubs } from '../data/clubs';

export default function Home() {
  const { goToClub } = useClubNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = searchQuery
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clubs;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <>
            <div className="px-6 pt-6 pb-2">
              <p className="text-gray-500 text-sm">
                搜索结果: {filteredClubs.length} 个社团匹配 "{searchQuery}"
              </p>
            </div>
            {filteredClubs.length > 0 ? (
              <ClubList clubs={filteredClubs} onClubClick={goToClub} />
            ) : (
              <div className="text-center py-20 text-gray-400 text-lg">
                未找到匹配的社团
              </div>
            )}
          </>
        ) : (
          categories.map((category, index) => {
            const categoryClubs = clubs.filter((club) => club.category === category);
            return (
              <CategorySection
                key={category}
                category={category}
                clubs={categoryClubs}
                onClubClick={goToClub}
                rowIndex={index}
              />
            );
          })
        )}
      </main>
      <Footer />
    </div>
  );
}
