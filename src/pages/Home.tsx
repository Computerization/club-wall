import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';
import ClubList from '../components/ClubList';
import { useClubNavigation } from '../hooks/useClub';
import { categories, clubs } from '../data/clubs';

export default function Home() {
  const { goToClub } = useClubNavigation();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = searchQuery
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clubs;

  const isSearching = searchQuery.length > 0;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue);
    }
  };

  const handleBack = () => {
    setSearchQuery('');
    setInputValue('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {isSearching ? (
        <header className="bg-[#1A5F4A] text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold tracking-wide">Club Wall</h1>
          </div>
        </header>
      ) : (
        <Header searchQuery={inputValue} onSearchChange={setInputValue} onSearchKeyDown={handleSearchKeyDown} />
      )}
      <main className="flex-1 overflow-y-auto">
        {isSearching ? (
          <>
            <div className="px-6 pt-6 pb-2">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#1A5F4A] hover:text-[#144a3a] mb-4">
                <span className="text-2xl">←</span>
                <span>返回</span>
              </button>
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
