import { useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';
import { useClub, useClubIdParam, useClubNavigation } from '../hooks/useClub';
import { clubBlurb, getCategoryMeta } from '../data/categoryMeta';
import { getSchoolListing, SCHOOL_WEBSITE_URL } from '../data/schoolNames';
import { pageRowCounts } from '../data/schoolNames';
import { asset } from '../data/clubs';
import { ClubLogo, ClubPoster, ClubCpQrcodeSection } from '../components/ClubMedia';
import { useLocation } from 'react-router-dom';

const RATING_IMG: Record<string, string> = {
  'five-star': 'icons/five-star-club.png',
  outstanding: 'icons/good-club.png',
};

/** Only colours deeper than 戏剧社's red (#C00000, luminance ≈0.112) get the
 *  light/white page skin. 戏剧社-level depth is treated as light → dark card. */
const LIGHT_SKIN_MAX_LUM = 0.111;

function luminance(hex: string): number {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = m.slice(1).map((h) => lin(parseInt(h, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function BackButton({ onClick, accent }: { onClick: () => void; accent: string }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-2 text-sm transition-colors hover:brightness-75 active:brightness-50"
      style={{ color: accent }}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="font-medium">返回 Back</span>
    </button>
  );
}

/** Bilingual label: 中文 slightly larger · English single-space after, no caps. */
function Bilingual({ cn, en, enStyle }: { cn: string; en: string; enStyle?: React.CSSProperties }) {
  return (
    <span>
      <span style={{ fontSize: '1.18em' }}>{cn}</span>{' '}
      <span style={{ fontSize: '0.85em', ...enStyle }}>{en}</span>
    </span>
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

export default function ClubDetail() {
  const clubId = useClubIdParam();
  const club = useClub(clubId);
  const { goHome } = useClubNavigation();
  const location = useLocation();
  const fromActivity = (location.state as any)?.fromActivity;

  const handleBack = fromActivity ? () => window.history.back() : goHome;

  const meta = club ? getCategoryMeta(club.category) : null;
  const light = club?.theme[0] ?? '#d9efe6';
  const main = club?.theme[1] ?? '#FA803D';
  const dark = club?.theme[2] ?? '#8A3B0E';

  const lightSkin = club ? luminance(main) <= LIGHT_SKIN_MAX_LUM : false;

  // Palette for the two skins (light/white page vs dark glass page).
  const skinBg = club
    ? lightSkin
      ? [
          'linear-gradient(180deg, rgba(248,246,239,0.98) 0%, rgba(236,230,212,0.98) 100%)',
          `radial-gradient(85% 90% at 8% 4%, ${main}4a, transparent 76%)`,
          `radial-gradient(65% 70% at 104% 106%, ${light}42, transparent 76%)`,
        ].join(', ')
      : [
          'linear-gradient(180deg, rgba(10,15,13,0.92) 0%, rgba(8,12,10,0.9) 100%)',
          `radial-gradient(80% 85% at 8% 4%, ${main}4d, transparent 74%)`,
          `radial-gradient(70% 75% at 104% 106%, ${dark}3a, transparent 76%)`,
          `radial-gradient(45% 45% at 92% -8%, ${light}26, transparent 70%)`,
        ].join(', ')
    : 'rgba(10,15,13,1)';

  const strongCol = lightSkin ? 'rgba(8,12,10,0.95)' : 'rgba(255,255,255,0.95)';
  const bodyCol = lightSkin ? 'rgba(8,12,10,0.82)' : 'rgba(255,255,255,0.8)';
  const faintCol = lightSkin ? 'rgba(8,12,10,0.45)' : 'rgba(255,255,255,0.45)';
  const chipBg = lightSkin ? 'rgba(8,12,10,0.05)' : 'rgba(255,255,255,0.06)';
  const divider = lightSkin ? 'rgba(8,12,10,0.12)' : 'rgba(255,255,255,0.1)';
  const enNameColor = `${main}B3`;
  const enName = club ? (getSchoolListing(club)?.en ?? club.name) : '';
  const listing = club ? getSchoolListing(club) : null;

  // Theme the page scrollbar (and --scr) with the club's colours.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-light', light);
    root.style.setProperty('--theme', main);
    root.style.setProperty('--theme-dark', dark);
    root.style.setProperty('--scr', main);
    return () => {
      root.style.removeProperty('--theme-light');
      root.style.removeProperty('--theme');
      root.style.removeProperty('--theme-dark');
      root.style.removeProperty('--scr');
    };
  }, [light, main, dark]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: skinBg }}>
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <BackButton onClick={handleBack} accent={main} />
          {club ? (
            <div className="pb-10">
              {/* Name + logo on one row; About flows directly under the name */}
              <div className="grid items-start gap-x-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-center gap-x-4">
                    <h1
                      className="font-display text-5xl font-bold leading-tight sm:text-6xl"
                      style={{ color: main }}
                    >
                      {club.name}
                    </h1>
                    {club.rating && (
                      <img
                        src={asset(RATING_IMG[club.rating])}
                        alt={club.rating === 'five-star' ? '五星社团' : '优秀社团'}
                        className="h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xl font-medium tracking-wide" style={{ color: enNameColor }}>
                    {enName}
                  </p>

                  <h3 className="mt-6 mb-3 text-sm font-semibold" style={{ color: main }}>
                    <Bilingual cn="关于社团" en="About" />
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: bodyCol }}>
                    {clubBlurb(club, '，留下属于你的高中印记')}
                  </p>
                  {club.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {club.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-sm"
                          style={{ color: strongCol, background: chipBg, border: `1px solid ${main}40` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <ClubLogo club={club} className="mx-auto max-h-24 w-auto max-w-full object-contain" />
                  <p className="mt-2 text-xs" style={{ color: faintCol }}>
                    {club.name} logo
                  </p>
                </div>
              </div>

              {/* Poster label above both columns so the poster image's top edge
                  lines up with the top of the info box */}
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold" style={{ color: main }}>
                  <Bilingual cn="招新海报" en="Poster" />
                </h3>
                <div className="grid items-start gap-x-8 gap-y-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <ClubPoster club={club} className={lightSkin ? 'w-full rounded-xl' : undefined} />
                  </div>

                  <aside
                    className="w-full rounded-xl px-4 py-4"
                    style={{
                      background: lightSkin ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${divider}`,
                    }}
                  >
                  {club.rating && (
                    <>
                      <div className="mb-2 flex items-center gap-2">
                        <img
                          src={asset(RATING_IMG[club.rating])}
                          alt={club.rating === 'five-star' ? '五星社团' : '优秀社团'}
                          className="h-9 w-auto object-contain"
                        />
                        <span className="text-sm font-medium" style={{ color: strongCol }}>
                          {club.rating === 'five-star' ? '五星社团' : '优秀社团'}
                        </span>
                      </div>
                      <div style={{ borderColor: divider }} className="mb-2 border-t" />
                    </>
                  )}
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt style={{ color: faintCol }}>
                        <Bilingual cn="领域" en="Category" />
                      </dt>
                      <dd style={{ color: strongCol }}>
                        {meta?.en} · {meta?.cn}
                      </dd>
                    </div>
                    <div>
                      <dt style={{ color: faintCol }}>
                        <Bilingual cn="方向" en="Focus" />
                      </dt>
                      <dd style={{ color: strongCol }}>{club.shortDesc}</dd>
                    </div>
                    {listing && (
                      <div>
                        <dt className="flex items-center gap-1.5" style={{ color: faintCol }}>
                          <Bilingual cn="校网位置" en="Website" />
                          <a
                            href={SCHOOL_WEBSITE_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="打开校园系统网站"
                            className="inline-flex text-current transition-opacity hover:opacity-80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </dt>
                        <dd className="flex flex-wrap items-baseline gap-x-1" style={{ color: strongCol }}>
                          第
                          <span className="text-xl font-extrabold" style={{ color: main }}>
                            {listing.page}
                          </span>
                          页 ·
                          {listing.row >= 15 ? (
                            <>
                              倒数第
                              <span className="text-xl font-extrabold" style={{ color: main }}>
                                {(pageRowCounts[listing.page] ?? 20) - listing.row + 1}
                              </span>
                              行
                            </>
                          ) : (
                            <>
                              第
                              <span className="text-xl font-extrabold" style={{ color: main }}>
                                {listing.row}
                              </span>
                              行
                            </>
                          )}
                        </dd>
                      </div>
                    )}
                    <div style={{ borderColor: divider }} className="border-t pt-3" />
                    {club.president?.trim() && (
                      <div>
                        <dt style={{ color: faintCol }}>
                          <Bilingual cn="社长" en="President" />
                        </dt>
                        <dd style={{ color: strongCol }}>{club.president}</dd>
                      </div>
                    )}
                    {club.vicePresidents.length > 0 && (
                      <div>
                        <dt style={{ color: faintCol }}>
                          <Bilingual cn="副社长" en="Vice Presidents" />
                        </dt>
                        <dd style={{ color: strongCol }}>{club.vicePresidents.join('、')}</dd>
                      </div>
                    )}
                    {club.contact?.trim() && (
                      <div>
                        <dt style={{ color: faintCol }}>
                          <Bilingual cn="微信" en="Contact" />
                        </dt>
                        <dd style={{ color: strongCol }}>{club.contact}</dd>
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
      <Footer light={lightSkin} />
    </div>
  );
}
