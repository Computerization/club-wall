import { Link } from 'react-router-dom';
import { clubs } from '../data/clubs';

// Credit links to our own club's page on the wall.
const computerizationClub = clubs.find((club) => club.name.includes('信息化'));

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg ring-1"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-light) 15%, transparent)',
              borderColor: 'color-mix(in srgb, var(--theme-light) 40%, transparent)',
              boxShadow: '0 0 0 1px color-mix(in srgb, var(--theme-light) 40%, transparent)',
              transition: 'background-color 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease',
            }}
          >
            <span className="font-display text-lg font-bold" style={{ color: 'var(--theme-light)', transition: 'color 0.6s ease' }}>C</span>
          </span>
          <span className="font-display text-xl font-semibold text-white">Club Wall</span>
          {computerizationClub && (
            <Link
              to={`/club/${computerizationClub.id}`}
              className="text-sm text-white/40 transition-colors hover:text-brand-light"
            >
              by Computerization
            </Link>
          )}
        </div>
        <p className="max-w-md text-sm text-white/45">
          世外 WFLA 社团招新 · 寻找属于你的舞台。<br />
          Discover, preview, and join the community that's right for you.
        </p>
        <p className="mt-2 text-xs text-white/30">
          © {new Date().getFullYear()} WFLA Club Wall · Made for incoming students
        </p>
      </div>
    </footer>
  );
}
