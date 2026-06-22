import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ClubList from '../components/ClubList';
import ClubPreviewModal from '../components/ClubPreviewModal';
import { useClubNavigation } from '../hooks/useClub';
import { categories, clubs } from '../data/clubs';
import type { Club } from '../data/clubs';

export default function Home() {
  const { goToClub } = useClubNavigation();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewClub, setPreviewClub] = useState<Club | null>(null);

  const filteredClubs = searchQuery
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clubs;

  const isSearching = searchQuery.length > 0;

  // Rendered as its own row below the auto-scrolling categories; `categories`
  // intentionally excludes this group so it only appears here, statically.
  const pendingClubs = clubs.filter((club) => club.category === 'ClubsToBeEstablished');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue);
    }
  };

  const handleBack = () => {
    setSearchQuery('');
    setInputValue('');
  };

  // Clicking any tile opens the immersive preview rather than navigating away.
  const openPreview = (id: string) => {
    const club = clubs.find((c) => c.id === id);
    if (club) setPreviewClub(club);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        searchQuery={inputValue}
        onSearchChange={setInputValue}
        onSearchKeyDown={handleSearchKeyDown}
        minimal={isSearching}
      />

      <main className="flex-1">
        {isSearching ? (
          <div className="pt-8">
            <div className="mx-auto max-w-7xl px-6 pb-6">
              <button
                onClick={handleBack}
                className="mb-5 inline-flex items-center gap-2 text-sm text-brand-light transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回 Back</span>
              </button>
              <h2 className="font-display text-3xl font-bold text-white">
                Search
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {filteredClubs.length} 个社团匹配 “{searchQuery}”
              </p>
            </div>
            {filteredClubs.length > 0 ? (
              <ClubList clubs={filteredClubs} onClubClick={openPreview} />
            ) : (
              <div className="py-24 text-center text-lg text-white/40">
                未找到匹配的社团 · No clubs found
              </div>
            )}
          </div>
        ) : (
          <>
            <Hero clubCount={clubs.length} categoryCount={categories.length} />

            {categories.map((category, index) => {
              const categoryClubs = clubs.filter((club) => club.category === category);
              return (
                <CategorySection
                  key={category}
                  category={category}
                  clubs={categoryClubs}
                  onClubClick={openPreview}
                  rowIndex={index}
                />
              );
            })}

            {pendingClubs.length > 0 && (
              <CategorySection
                category="ClubsToBeEstablished"
                clubs={pendingClubs}
                onClubClick={openPreview}
                disableAutoScroll
              />
            )}
          </>
        )}
      </main>

      <Footer />

      <ClubPreviewModal
        club={previewClub}
        onClose={() => setPreviewClub(null)}
        onOpenFull={(id) => {
          setPreviewClub(null);
          goToClub(id);
        }}
      />
    </div>
  );
}
