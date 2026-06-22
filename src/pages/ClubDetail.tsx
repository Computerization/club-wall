import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { useClub, useClubIdParam, useClubNavigation } from '../hooks/useClub';
import { clubBlurb, getCategoryMeta } from '../data/categoryMeta';
import { clubImageSrc } from '../data/clubs';
import type { Club } from '../data/clubs';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-2 text-sm text-brand-light transition-colors hover:text-white"
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
        className="mt-6 rounded-full bg-brand-light px-5 py-2.5 text-sm font-semibold text-ink-950 transition-transform hover:scale-105"
      >
        返回首页 Home
      </button>
    </div>
  );
}

function ClubHeader({ club }: { club: Club }) {
  const meta = getCategoryMeta(club.category);
  const src = clubImageSrc(club);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lift ring-1 ring-white/10">
      <div className="relative h-72 w-full sm:h-96">
        {src ? (
          <img src={src} alt={club.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900 text-white/40">
            {club.name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <div
          className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ color: meta.accent, border: `1px solid ${meta.accent}`, background: 'rgba(0,0,0,0.4)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.accent }} />
          {meta.en} · {meta.cn}
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
          {club.name}
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
          {club.shortDesc}
        </p>
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const clubId = useClubIdParam();
  const club = useClub(clubId);
  const { goHome } = useClubNavigation();
  const meta = club ? getCategoryMeta(club.category) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <BackButton onClick={goHome} />
          {club ? (
            <div className="animate-fade-up">
              <ClubHeader club={club} />

              {/* Intro */}
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="eyebrow mb-3 text-xs font-semibold" style={{ color: meta?.accent }}>
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
                          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${meta?.accent}40` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <aside className="glass rounded-2xl p-5">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                    信息 · Info
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-white/40">领域 Category</dt>
                      <dd className="text-white">{meta?.en} · {meta?.cn}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">方向 Focus</dt>
                      <dd className="text-white">{club.shortDesc}</dd>
                    </div>
                    {club.contact?.trim() && (
                      <div>
                        <dt className="text-white/40">联系 Contact</dt>
                        <dd className="text-white">{club.contact}</dd>
                      </div>
                    )}
                  </dl>
                </aside>
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
