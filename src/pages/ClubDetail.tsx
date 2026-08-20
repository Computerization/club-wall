import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { useClub, useClubIdParam, useClubNavigation } from '../hooks/useClub';
import { clubBlurb, getCategoryMeta } from '../data/categoryMeta';
import { asset } from '../data/clubs';
import type { Club } from '../data/clubs';
import ClubCover, { ClubPoster, ClubCpQrcodeSection, ClubLogo } from '../components/ClubMedia';

const RATING_IMG: Record<string, string> = {
  'five-star': 'icons/five-star-club.png',
  outstanding: 'icons/good-club.png',
};
import { useLocation } from 'react-router-dom';

function BackButton({ onClick, accent }: { onClick: () => void; accent: string }) {
  return (
    <button
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-white active:brightness-50"
      style={{ color: accent }}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="font-medium">返回 Back</span>
    </button>
  );
}

function NotFound({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="py-24 text-center">
      <h2 className="font-display text-3xl font-bold text-white/70">社团未找到</h2>
      <p className="mt-2 text-white/40">This club could not be found.</p>
      <button
        onClick={onGoHome}
        className="mt-6 rounded-full bg-brand-light px-5 py-2.5 text-sm font-semibold text-ink-950 transition-transform hover:scale-105 active:brightness-50"
      >
        返回首页 Home
      </button>
    </div>
  );
}

function ClubHeader({ club }: { club: Club }) {
  const meta = getCategoryMeta(club.category);
  const accent = club.theme[0];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lift ring-1 ring-white/10">
      <div className="relative h-72 w-full sm:h-96">
        <ClubCover club={club} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ color: accent, border: `1px solid ${accent}`, background: 'rgba(0,0,0,0.4)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            {meta.en} · {meta.cn}
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
            {club.name}
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: accent }}>
            {club.shortDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const clubId = useClubIdParam();
  const club = useClub(clubId);
  const { goHome } = useClubNavigation();
  const location = useLocation();
  const fromActivity = (location.state as any)?.fromActivity;

  const handleBack = fromActivity
    ? () => window.history.back()
    : goHome;
  const meta = club ? getCategoryMeta(club.category) : null;
  const accent = club ? club.theme[0] : null;

  // Apply the club's logo theme to the page (background, accents, scrollbar)
  // by overriding the global CSS variables while this page is mounted.
  useEffect(() => {
    if (!club) return;
    const [light, main, dark] = club.theme;
    const root = document.documentElement;
    root.style.setProperty('--theme-light', light);
    root.style.setProperty('--theme', main);
    root.style.setProperty('--theme-dark', dark);
    return () => {
      root.style.removeProperty('--theme-light');
      root.style.removeProperty('--theme');
      root.style.removeProperty('--theme-dark');
    };
  }, [club]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <BackButton onClick={handleBack} accent={accent ?? 'var(--theme-light)'} />
          {club ? (
            <div className="animate-fade-up">
              <ClubHeader club={club} />

              {/* Intro */}
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="eyebrow mb-3 text-xs font-semibold" style={{ color: accent ?? undefined }}>
                    关于社团 · About
                  </h3>
                  <p className="text-base leading-relaxed text-white/75">
                    {clubBlurb(club, '，留下属于你的高中印记')}
                  </p>
                  {club.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {club.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-sm text-white/80"
                          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}40` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* The club's own recruitment poster, resolved automatically from
                      public/posters/{id}.jpg (falls back to a placeholder if absent). */}
                  <div className="mt-8">
                    <h3 className="eyebrow mb-4 text-xs font-semibold" style={{ color: accent ?? undefined }}>
                      招新海报 · Poster
                    </h3>
                    <ClubPoster club={club} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-6 text-center">
                    <ClubLogo club={club} className="mx-auto w-3/4 max-w-[200px] object-contain" />
                    <p className="mt-2 text-xs text-white/40">{club.name} logo</p>
                  </div>
                  <aside className="glass w-full rounded-2xl p-5">
                  {club.rating && (
                    <div className="mb-4 flex items-center gap-2">
                      <img
                        src={asset(RATING_IMG[club.rating])}
                        alt={club.rating === 'five-star' ? '五星社团' : '优秀社团'}
                        className="h-14 w-auto object-contain"
                      />
                      <span className="text-sm font-medium text-white/80">
                        {club.rating === 'five-star' ? '五星社团' : '优秀社团'}
                      </span>
                    </div>
                  )}
                  {club.rating && <div className="my-4 border-t border-white/5" />}
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-white/40">领域 Category</dt>
                      <dd className="text-white">{meta?.en} · {meta?.cn}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">方向 Focus</dt>
                      <dd className="text-white">{club.shortDesc}</dd>
                    </div>
                    <div className="my-4 border-t border-white/5" />
                    {club.president?.trim() && (
                      <div>
                        <dt className="text-white/40">社长 President</dt>
                        <dd className="text-white">{club.president}</dd>
                      </div>
                    )}
                    {club.vicePresidents.length > 0 && (
                      <div>
                        <dt className="text-white/40">副社长 Vice Presidents</dt>
                        <dd className="text-white">{club.vicePresidents.join('、')}</dd>
                      </div>
                    )}
                    {club.contact?.trim() && (
                      <div>
                        <dt className="text-white/40">微信 Contact</dt>
                        <dd className="text-white">{club.contact}</dd>
                      </div>
                    )}
                  </dl>

                  <ClubCpQrcodeSection club={club} />
                  </aside>
                </div>
              </div>
            </div>
          ) : (
            <NotFound onGoHome={goHome} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
