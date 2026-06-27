import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Shuffle, Play, Pause } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ClubList from '../components/ClubList';
import ClubPreviewModal from '../components/ClubPreviewModal';
import UpcomingActivities from '../components/UpcomingActivities';
import { useClubNavigation } from '../hooks/useClub';
import { categories, clubs } from '../data/clubs';
import type { Club } from '../data/clubs';
import { pickWeightedClub } from '../data/clubWeights';

export default function Home() {
  const { goToClub } = useClubNavigation();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewClub, setPreviewClub] = useState<Club | null>(null);
  // When true, the auto-scrolling marquee animation is disabled and rows tile
  // into a static grid instead. Toggled from the floating corner control.
  const [tiled, setTiled] = useState(false);
  // The floating corner controls only appear once the user scrolls past the hero.
  const [scrolled, setScrolled] = useState(false);

  // Easter egg: after the random pick is used 20 times, the hero button vanishes
  // and the corner random button turns "shy" — fleeing the cursor around the screen.
  const TRIGGER_COUNT = 20;
  // Elliptical detection — reaches further horizontally than vertically to match
  // the wide, rectangular button shape.
  const EVADE_X = 260;
  const EVADE_Y = 150;
  const RANDOM_BOTTOM = 84;   // px the random button rests above the bottom edge
  const randomCount = useRef(0);
  const [eggActive, setEggActive] = useState(false);
  const [showEggMsg, setShowEggMsg] = useState(false);
  const restRef = useRef<HTMLButtonElement>(null);
  const evadeRef = useRef<HTMLButtonElement>(null);
  const [evadePos, setEvadePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // While active, dodge the cursor whenever it gets close — biased toward the
  // screen centre so it doesn't just hug the edges.
  useEffect(() => {
    if (!eggActive) return;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));

    // Elliptical proximity of a point (px,py) to the cursor: <1 means inside the
    // trigger zone, which is wider horizontally than vertically.
    const ellipticDist = (px: number, py: number, mx: number, my: number) =>
      Math.hypot((px - mx) / EVADE_X, (py - my) / EVADE_Y);

    const onMove = (e: MouseEvent) => {
      const btn = evadeRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nd = ellipticDist(cx, cy, e.clientX, e.clientY);
      if (nd >= 1) return;

      let dx = cx - e.clientX;
      let dy = cy - e.clientY;
      let dist = Math.hypot(dx, dy);
      if (dist === 0) {
        dx = Math.random() - 0.5;
        dy = Math.random() - 0.5;
        dist = Math.hypot(dx, dy) || 1;
      }
      // Unit vector fleeing the cursor, blended with a pull toward the centre.
      const ax = dx / dist;
      const ay = dy / dist;
      let tx = window.innerWidth / 2 - cx;
      let ty = window.innerHeight / 2 - cy;
      const tlen = Math.hypot(tx, ty) || 1;
      tx /= tlen;
      ty /= tlen;
      const BLEND = 0.4; // 0 = pure flee, 1 = straight to centre
      let vx = ax * (1 - BLEND) + tx * BLEND;
      let vy = ay * (1 - BLEND) + ty * BLEND;
      const vlen = Math.hypot(vx, vy) || 1;
      vx /= vlen;
      vy /= vlen;

      // Generous margins keep the button out of the screen edges.
      const marginX = Math.max(32, window.innerWidth * 0.09);
      const marginY = Math.max(32, window.innerHeight * 0.09);
      const maxX = window.innerWidth - r.width - marginX;
      const maxY = window.innerHeight - r.height - marginY;
      // Closer cursor (smaller nd) → bigger leap.
      const jump = (1 - nd) * 220 + 80;
      let nx = clamp(r.left + vx * jump, marginX, maxX);
      let ny = clamp(r.top + vy * jump, marginY, maxY);

      // Cornered — can't get far enough away by fleeing, so teleport elsewhere.
      if (ellipticDist(nx + r.width / 2, ny + r.height / 2, e.clientX, e.clientY) < 1) {
        for (let i = 0; i < 24; i++) {
          nx = marginX + Math.random() * (maxX - marginX);
          ny = marginY + Math.random() * (maxY - marginY);
          if (ellipticDist(nx + r.width / 2, ny + r.height / 2, e.clientX, e.clientY) > 2) break;
        }
      }
      setEvadePos({ x: nx, y: ny });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [eggActive]);

  const filteredClubs = searchQuery
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : clubs;

  const isSearching = searchQuery.length > 0;

  // Randomize the category row order once per page load (Fisher-Yates), so the
  // wall feels fresh on each refresh. The Forming row stays pinned at the bottom.
  const orderedCategories = useMemo(() => {
    const arr = [...categories];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

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

  // Surprise Me: pop open a random club's preview, honoring clubWeights.
  const openRandomClub = () => {
    const club = pickWeightedClub(clubs);
    if (club) setPreviewClub(club);
    randomCount.current += 1;
    if (randomCount.current >= TRIGGER_COUNT && !eggActive) {
      // Seed the shy button at the resting button's exact spot so it doesn't jump.
      const rect = restRef.current?.getBoundingClientRect();
      if (rect) {
        setEvadePos({ x: rect.left, y: rect.top });
      } else {
        const w = 140;
        const h = 46;
        setEvadePos({ x: window.innerWidth - w - 24, y: window.innerHeight - h - RANDOM_BOTTOM });
      }
      setEggActive(true);
      setShowEggMsg(true);
      window.setTimeout(() => setShowEggMsg(false), 4500);
    }
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
            <Hero
              clubCount={clubs.length}
              categoryCount={categories.length}
              onRandomClub={openRandomClub}
              hideRandom={eggActive}
            />

            <UpcomingActivities />

            {orderedCategories.map((category, index) => {
              const categoryClubs = clubs.filter((club) => club.category === category);
              return (
                <CategorySection
                  key={category}
                  category={category}
                  clubs={categoryClubs}
                  onClubClick={openPreview}
                  rowIndex={index}
                  // Too few cards to fill the row — show them static & centered
                  // instead of an awkward auto-scrolling marquee.
                  disableAutoScroll={categoryClubs.length <= 6}
                  tiled={tiled}
                />
              );
            })}

            {pendingClubs.length > 0 && (
              <CategorySection
                category="ClubsToBeEstablished"
                clubs={pendingClubs}
                onClubClick={openPreview}
                rowIndex={1}
                tiled={tiled}
              />
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Floating corner controls — always on top, bottom-right. Only meaningful
          on the gallery view (hidden while searching) and revealed once the user
          scrolls past the hero. Each button is positioned independently so the
          animation toggle stays put even when the random button turns evasive. */}
      {!isSearching && (
        <button
          onClick={() => setTiled((t) => !t)}
          aria-pressed={tiled}
          title={tiled ? '启用滚动动画' : '禁用滚动动画'}
          className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold
                     text-white shadow-lift transition-all duration-300 hover:scale-105
                     ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}
                     ${tiled ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 hover:bg-red-400'}`}
        >
          {tiled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          <span>{tiled ? '启用动画' : '禁用动画'}</span>
        </button>
      )}

      {/* Random button — rests just above the toggle; turns evasive after the egg. */}
      {!isSearching && !eggActive && (
        <button
          ref={restRef}
          onClick={openRandomClub}
          style={{ bottom: RANDOM_BOTTOM }}
          className={`fixed right-6 z-50 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold
                     text-ink-900 shadow-lift transition-all duration-300 hover:scale-105 hover:bg-brand-light hover:text-white
                     ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        >
          <Shuffle className="h-4 w-4" />
          <span>随机社团</span>
        </button>
      )}

      {/* Easter egg: the shy random button, fleeing the cursor around the screen. */}
      {!isSearching && eggActive && (
        <button
          ref={evadeRef}
          onClick={openRandomClub}
          style={{ left: evadePos.x, top: evadePos.y }}
          className="fixed z-50 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold
                     text-ink-900 shadow-lift transition-[left,top] duration-200 ease-out hover:bg-brand-light hover:text-white"
        >
          <Shuffle className="h-4 w-4" />
          <span>随机社团</span>
        </button>
      )}

      {/* Easter egg announcement — fires once when the button turns shy. */}
      {showEggMsg && (
        <div className="fixed left-1/2 top-24 z-[60] -translate-x-1/2 animate-fade-up rounded-2xl bg-ink-900/90 px-6 py-4
                        text-center shadow-lift ring-1 ring-white/15 backdrop-blur-md">
          <p className="font-display text-lg font-bold text-white">😈 这次我可不让你点到了！</p>
          <p className="mt-1 text-sm text-white/60">Catch me if you can — I won't let you click again!</p>
        </div>
      )}

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
